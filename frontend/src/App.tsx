import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { CreateDonationPage } from '@/pages/donor/CreateDonationPage';
import { EditDonationPage } from '@/pages/donor/EditDonationPage';
import { MyDonationsPage } from '@/pages/donor/MyDonationsPage';
import { DonorDonationDetailPage } from '@/pages/donor/DonationDetailPage';
import { DonorClaimsPage } from '@/pages/donor/DonorClaimsPage';
import { BrowseDonationsPage } from '@/pages/receiver/BrowseDonationsPage';
import { ReceiverDonationDetailPage } from '@/pages/receiver/DonationDetailPage';
import { MyClaimsPage } from '@/pages/receiver/MyClaimsPage';
import { AvailableDeliveriesPage } from '@/pages/volunteer/AvailableDeliveriesPage';
import { MyDeliveriesPage } from '@/pages/volunteer/MyDeliveriesPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { AllDonationsPage } from '@/pages/admin/AllDonationsPage';
import { AllClaimsPage } from '@/pages/admin/AllClaimsPage';
import { AllDeliveriesPage } from '@/pages/admin/AllDeliveriesPage';
import { ComplaintsPage } from '@/pages/admin/ComplaintsPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes — all share MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Donor */}
          <Route element={<ProtectedRoute allowedRoles={['DONOR']} />}>
            <Route path="/donor/donations" element={<MyDonationsPage />} />
            <Route path="/donor/donations/new" element={<CreateDonationPage />} />
            <Route path="/donor/donations/:id/edit" element={<EditDonationPage />} />
            <Route path="/donor/donations/:id" element={<DonorDonationDetailPage />} />
            <Route path="/donor/claims" element={<DonorClaimsPage />} />
          </Route>

          {/* Receiver */}
          <Route element={<ProtectedRoute allowedRoles={['RECEIVER']} />}>
            <Route path="/receiver/donations" element={<BrowseDonationsPage />} />
            <Route path="/receiver/donations/:id" element={<ReceiverDonationDetailPage />} />
            <Route path="/receiver/claims" element={<MyClaimsPage />} />
          </Route>

          {/* Volunteer */}
          <Route element={<ProtectedRoute allowedRoles={['VOLUNTEER']} />}>
            <Route path="/volunteer/deliveries" element={<AvailableDeliveriesPage />} />
            <Route path="/volunteer/deliveries/my" element={<MyDeliveriesPage />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/donations" element={<AllDonationsPage />} />
            <Route path="/admin/claims" element={<AllClaimsPage />} />
            <Route path="/admin/deliveries" element={<AllDeliveriesPage />} />
            <Route path="/admin/complaints" element={<ComplaintsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
