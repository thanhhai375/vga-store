package com.example.vgashop.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.vgashop.repository.ApiResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {

    // RESOURCE NOT FOUND (X l khi khng tm thy resource (404))

    // @ExceptionHandler(
    //     ResourceNotFoundException.class
    // )
    // public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
    //     ApiError error = new ApiError(HttpStatus.NOT_FOUND.value(), "Not Found", ex.getMessage());

    //     return new ResponseEntity<> (
    //         error,
    //         HttpStatus.NOT_FOUND
    //     );
    // }

    // dng API response
    @ExceptionHandler(
        ResourceNotFoundException.class
    )
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());

        return new ResponseEntity<> (
            response,
            HttpStatus.NOT_FOUND
        );
    }

    // DUPLICATE RESOURCE (X l khi d liu b trng (409 Conflict))
    // @ExceptionHandler(
    //     DuplicateResourceException.class
    // )
    // public ResponseEntity<ApiError> handleDuplicate(DuplicateResourceException ex) {
    //     ApiError error = new ApiError(HttpStatus.CONFLICT.value(),"Conflict", ex.getMessage());

    //     return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    // }

     // dng API Response
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResource(DuplicateResourceException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

     // VALIDATION ERROR (X l li validation (@Valid + @NotBlank, @Size...))
    //  @ExceptionHandler(MethodArgumentNotValidException.class)
    //  public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
    //     Map<String, String> errors = new HashMap<>();

    //     ex.getBindingResult()
    //              .getFieldErrors()
    //              .forEach(error ->
    //                 errors.put(error.getField(), error.getDefaultMessage())
    //              );
        
    // // to ApiError  tr format thng nht
    //     ApiError apiError = new ApiError(
    //         HttpStatus.BAD_REQUEST.value(),
    //         "Validation Failed",
    // "D liu khng hp l!"
    //     );

    // // to bo li chi tit
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("Status", apiError.getStatus());
    //     response.put("error", apiError.getError());
    //     response.put("message", apiError.getMessage());
    //     response.put("timestamp", apiError.getTimestamp());
    // response.put("errors", errors); // chi tit tng field li
    //     // return new ResponseEntity<> (errors, HttpStatus.BAD_REQUEST);
    //     return new ResponseEntity<> (response, HttpStatus.BAD_REQUEST);
    // }

    // dng API Response
    @ExceptionHandler(MethodArgumentNotValidException.class)
     public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                 .getFieldErrors()
                 .forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
                 );
        
        // to ApiError  tr format thng nht
        ApiResponse<Object> response = new ApiResponse<>(
            false,
            "Dữ liệu không hợp lệ",
            errors
        );
        return new ResponseEntity<> (response, HttpStatus.BAD_REQUEST);
    }

    // GENERAL ERROR (X l tt c cc exception cn li (500))
    // @ExceptionHandler(Exception.class)
    // public ResponseEntity<ApiError> handleGeneral(Exception ex) {
    //     ApiError error = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
    // " xy ra li h thng. Vui lng th li sau!");

    // // // Ch log li tht, khng tr stack trace v client
    //     ex.printStackTrace();
    //     return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    // }

    // dng API Response
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex) {
        ApiResponse<Object> response = ApiResponse.error("Đã xảy ra lỗi hệ thống vui lòng thử lại!");
        // // Ch log li tht, khng tr stack trace v client
        ex.printStackTrace();
        ApiError error = new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR.value(), 
        "Internal Server Error",
        ex.getMessage() != null ? ex.getMessage() : "Đã xảy ra lỗi hệ thống"
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
