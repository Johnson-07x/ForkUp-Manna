import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClearIcon from '@mui/icons-material/Clear';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { DonationMap } from '@/components/map/DonationMap';
import { PageHeader } from '@/components/common/PageHeader';
import { uploadApi } from '@/api/uploads';
import { useCreateDonation } from '@/hooks/useDonations';

const schema = z.object({
  title:              z.string().min(3, 'Title must be at least 3 characters').max(200),
  description:        z.string().optional(),
  foodType:           z.enum(['VEG', 'NON_VEG', 'BOTH']),
  quantity:           z.string().min(1, 'Quantity is required'),
  servesPeople:       z.string().optional(),
  expiryDate:         z.string().min(1, 'Expiry date is required'),
  expiryTime:         z.string().min(1, 'Expiry time is required'),
  address:            z.string().min(5, 'Address is required'),
  city:               z.string().min(2, 'City is required'),
  state:              z.string().min(2, 'State is required'),
  pincode:            z.string().regex(/^[0-9]{6}$/, 'Enter a valid 6-digit pincode').optional().or(z.literal('')),
  pickupInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

interface LocalityItem { name: string; description: string; }

async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );
  if (!res.ok) throw new Error(`Geocoding HTTP error ${res.status}`);
  const data = await res.json();

  const informative: LocalityItem[] = data.localityInfo?.informative ?? [];
  const administrative: LocalityItem[] = data.localityInfo?.administrative ?? [];

  const road = informative.find((i) =>
    /road|street|avenue|lane|highway/i.test(i.description ?? '')
  )?.name ?? '';

  const neighbourhood = informative.find((i) =>
    /neighbourhood|suburb|quarter|hamlet|village/i.test(i.description ?? '')
  )?.name ?? '';

  const streetParts = [road, neighbourhood].filter(Boolean);
  const street = streetParts.join(', ') || data.locality || '';

  // For Indian addresses: locality level can be city or the admin subdivision
  const adminCity = administrative.find((a) =>
    /city|town|municipality|taluk/i.test(a.description ?? '')
  )?.name ?? '';

  const city = data.city || adminCity || data.locality || '';
  const state = data.principalSubdivision || '';
  const pincode = (data.postcode || '').replace(/\s/g, '').slice(0, 6);

  return { street, city, state, pincode };
}

export function CreateDonationPage() {
  const navigate = useNavigate();
  const { mutate: create, isPending } = useCreateDonation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mapPos, setMapPos] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
  const [mapPinned, setMapPinned] = useState(false);
  const [locating, setLocating] = useState(false);
  const [serverError, setServerError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { foodType: 'VEG' },
  });

  const applyGeolocation = useCallback(async (lat: number, lng: number, pinLocation: boolean, showToast: boolean) => {
    setMapPos({ lat, lng });
    if (pinLocation) setMapPinned(true);
    try {
      const geo = await reverseGeocode(lat, lng);
      const filled: string[] = [];
      if (geo.street) { setValue('address', geo.street, { shouldValidate: true }); filled.push('address'); }
      if (geo.city)   { setValue('city', geo.city, { shouldValidate: true }); filled.push('city'); }
      if (geo.state)  { setValue('state', geo.state, { shouldValidate: true }); filled.push('state'); }
      if (geo.pincode && /^[0-9]{6}$/.test(geo.pincode)) {
        setValue('pincode', geo.pincode, { shouldValidate: true }); filled.push('pincode');
      }
      if (showToast && filled.length > 0) {
        toast.success(`Location detected! Filled: ${filled.join(', ')}.`);
      } else if (showToast) {
        toast.info('Location detected, but could not auto-fill address fields. Please fill them manually.');
      }
    } catch (err) {
      console.error('Reverse geocode error:', err);
      if (showToast) toast.warning('Location pinned on map, but address lookup failed. Please fill the fields manually.');
    }
  }, [setValue]);

  // Silently try to get location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => applyGeolocation(coords.latitude, coords.longitude, false, false),
      () => { /* permission denied or unavailable — stay at default center */ },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [applyGeolocation]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        applyGeolocation(coords.latitude, coords.longitude, true, true)
          .finally(() => setLocating(false));
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location access denied. Please allow location access in your browser settings.');
        } else {
          toast.error('Could not get your location. Please try again or enter the address manually.');
        }
      },
      { timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10 MB.'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    let imageUrl: string | undefined;

    if (imageFile) {
      setUploading(true);
      try {
        const res = await uploadApi.uploadImage(imageFile);
        imageUrl = res.data.data;
      } catch {
        toast.error('Failed to upload image. Please try again.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Combine date + time and add seconds so Jackson parses it correctly
    const expiryDateTime = `${values.expiryDate}T${values.expiryTime}:00`;

    const payload = {
      title:              values.title,
      description:        values.description || undefined,
      foodType:           values.foodType,
      quantity:           values.quantity,
      servesPeople:       values.servesPeople ? parseInt(values.servesPeople, 10) : undefined,
      expiryTime:         expiryDateTime,
      address:            values.address,
      city:               values.city,
      state:              values.state,
      pincode:            values.pincode || undefined,
      pickupInstructions: values.pickupInstructions || undefined,
      latitude:           mapPinned ? mapPos.lat : undefined,
      longitude:          mapPinned ? mapPos.lng : undefined,
      imageUrl,
    };

    create(payload, {
      onSuccess: () => navigate('/donor/donations'),
      onError: (e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Failed to create donation.';
        setServerError(msg);
      },
    });
  };

  const isSubmitting = isPending || uploading;

  return (
    <Box>
      <PageHeader
        title="Post a Donation"
        subtitle="Fill in the details about the food you want to donate"
        action={{ label: 'Back', onClick: () => navigate('/donor/donations') }}
      />

      {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>

          {/* ── Basic info ── */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoOutlinedIcon fontSize="small" color="primary" /> Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Donation title *" error={!!errors.title}
                               helperText={errors.title?.message} {...register('title')} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Description" multiline rows={3}
                               placeholder="Describe the food (e.g., freshly cooked rice and curry)"
                               error={!!errors.description} helperText={errors.description?.message}
                               {...register('description')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller name="foodType" control={control}
                      render={({ field }) => (
                        <TextField select label="Food type *" {...field} error={!!errors.foodType}
                                   helperText={errors.foodType?.message}>
                          <MenuItem value="VEG">Vegetarian</MenuItem>
                          <MenuItem value="NON_VEG">Non-Vegetarian</MenuItem>
                          <MenuItem value="BOTH">Mixed (Veg &amp; Non-Veg)</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Quantity *" placeholder="e.g. 20 meals, 5 kg rice"
                               error={!!errors.quantity} helperText={errors.quantity?.message}
                               {...register('quantity')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Serves (people)" type="number"
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><PeopleIcon fontSize="small" /></InputAdornment> } }}
                      error={!!errors.servesPeople}
                      helperText={errors.servesPeople?.message as string}
                      {...register('servesPeople')}
                    />
                  </Grid>

                  {/* ── Expiry: separate date & time ── */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Expiry date *"
                      type="date"
                      slotProps={{
                        input: { startAdornment: <InputAdornment position="start"><CalendarTodayIcon fontSize="small" /></InputAdornment> },
                        inputLabel: { shrink: true },
                        htmlInput: { min: new Date().toISOString().slice(0, 10) },
                      }}
                      error={!!errors.expiryDate}
                      helperText={errors.expiryDate?.message}
                      {...register('expiryDate')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Expiry time *"
                      type="time"
                      slotProps={{
                        input: { startAdornment: <InputAdornment position="start"><AccessTimeIcon fontSize="small" /></InputAdornment> },
                        inputLabel: { shrink: true },
                      }}
                      error={!!errors.expiryTime}
                      helperText={errors.expiryTime?.message}
                      {...register('expiryTime')}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField label="Pickup instructions" multiline rows={2}
                               placeholder="e.g. Call before arriving, available from 6–8 PM"
                               error={!!errors.pickupInstructions} helperText={errors.pickupInstructions?.message}
                               {...register('pickupInstructions')} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ── Image upload ── */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddPhotoAlternateIcon fontSize="small" color="primary" /> Donation Photo (optional)
                </Typography>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />

                {imagePreview ? (
                  <Box>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{ width: '100%', maxWidth: 420, height: 220, objectFit: 'cover', borderRadius: 2, display: 'block' }}
                    />
                    <Button size="small" variant="outlined" color="error" onClick={removeImage}
                            startIcon={<ClearIcon />} sx={{ mt: 1 }}>
                      Remove photo
                    </Button>
                  </Box>
                ) : (
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: '2px dashed', borderColor: 'divider', borderRadius: 2,
                      p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                      cursor: 'pointer', color: 'text.secondary',
                      transition: 'border-color 0.2s, background 0.2s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                    <Typography variant="body2">Click to upload a photo</Typography>
                    <Typography variant="caption">JPG, PNG, WebP or GIF · max 10 MB</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* ── Location ── */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" color="primary" /> Pickup Location
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={locating ? <CircularProgress size={14} /> : <GpsFixedIcon />}
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                  >
                    {locating ? 'Detecting…' : 'Use Current Location'}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Street address *" placeholder="Building, street name"
                               error={!!errors.address} helperText={errors.address?.message}
                               {...register('address')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="City *" error={!!errors.city} helperText={errors.city?.message}
                               {...register('city')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="State *" error={!!errors.state} helperText={errors.state?.message}
                               {...register('state')} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label="Pincode" error={!!errors.pincode}
                               helperText={errors.pincode?.message} {...register('pincode')} />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Click on the map to pin the exact pickup location (optional):
                  </Typography>
                  <DonationMap
                    latitude={mapPos.lat}
                    longitude={mapPos.lng}
                    interactive
                    flyToOnChange
                    height={320}
                    onLocationChange={(lat, lng) => applyGeolocation(lat, lng, true, false)}
                  />
                  {mapPinned && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
                      ✓ Location pinned at {mapPos.lat.toFixed(5)}, {mapPos.lng.toFixed(5)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" size="large" type="submit" disabled={isSubmitting}>
            {uploading ? 'Uploading photo…' : isPending ? 'Posting…' : 'Post Donation'}
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/donor/donations')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
