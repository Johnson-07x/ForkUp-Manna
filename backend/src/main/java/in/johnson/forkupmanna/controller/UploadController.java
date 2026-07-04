package in.johnson.forkupmanna.controller;

import in.johnson.forkupmanna.common.ApiResponse;
import in.johnson.forkupmanna.exception.AppException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/uploads")
@Slf4j
public class UploadController {

    private static final String UPLOAD_DIR = System.getProperty("user.home") + "/.forkupmanna/uploads/images";
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp", ".gif");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    @PostMapping("/images")
    @Operation(summary = "Upload a donation image")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new AppException("File is empty", HttpStatus.BAD_REQUEST);
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException("File size exceeds 10 MB limit", HttpStatus.BAD_REQUEST);
        }

        String original = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload");
        String ext = original.contains(".")
                ? original.substring(original.lastIndexOf('.')).toLowerCase()
                : ".jpg";

        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new AppException("Only image files (jpg, jpeg, png, webp, gif) are allowed", HttpStatus.BAD_REQUEST);
        }

        String filename = UUID.randomUUID() + ext;
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        log.info("Image uploaded: {}", filename);

        String fileUrl = "/api/v1/uploads/images/" + filename;
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", fileUrl));
    }

    @GetMapping("/images/{filename:.+}")
    @Operation(summary = "Serve an uploaded image")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        Path file = uploadPath.resolve(filename).normalize();
        if (!file.startsWith(uploadPath)) {
            throw new AppException("Invalid filename", HttpStatus.BAD_REQUEST);
        }
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new AppException("File not found", HttpStatus.NOT_FOUND);
        }
        String contentType = Files.probeContentType(file);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
