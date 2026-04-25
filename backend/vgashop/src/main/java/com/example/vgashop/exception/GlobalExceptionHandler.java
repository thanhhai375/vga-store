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

    // RESOURCE NOT FOUND (Xử lý khi không tìm thấy resource (404))

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

    // dùng API response
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

    // DUPLICATE RESOURCE (Xử lý khi dữ liệu bị trùng (409 Conflict))
    // @ExceptionHandler(
    //     DuplicateResourceException.class
    // )
    // public ResponseEntity<ApiError> handleDuplicate(DuplicateResourceException ex) {
    //     ApiError error = new ApiError(HttpStatus.CONFLICT.value(),"Conflict", ex.getMessage());

    //     return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    // }

     // dùng API Response
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResource(DuplicateResourceException ex) {
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

     // VALIDATION ERROR (Xử lý lỗi validation (@Valid + @NotBlank, @Size...))
    //  @ExceptionHandler(MethodArgumentNotValidException.class)
    //  public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
    //     Map<String, String> errors = new HashMap<>();

    //     ex.getBindingResult()
    //              .getFieldErrors()
    //              .forEach(error ->
    //                 errors.put(error.getField(), error.getDefaultMessage())
    //              );
        
    //     // tạo ApiError để trả format thống nhất 
    //     ApiError apiError = new ApiError(
    //         HttpStatus.BAD_REQUEST.value(),
    //         "Validation Failed",
    //         "Dữ liệu không hợp lệ!"
    //     );

    //     // tạo báo lỗi chi tiết
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("Status", apiError.getStatus());
    //     response.put("error", apiError.getError());
    //     response.put("message", apiError.getMessage());
    //     response.put("timestamp", apiError.getTimestamp());
    //     response.put("errors", errors); // chi tiết từng field lỗi
    //     // return new ResponseEntity<> (errors, HttpStatus.BAD_REQUEST);
    //     return new ResponseEntity<> (response, HttpStatus.BAD_REQUEST);
    // }

    // dùng API Response
    @ExceptionHandler(MethodArgumentNotValidException.class)
     public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                 .getFieldErrors()
                 .forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
                 );
        
        // tạo ApiError để trả format thống nhất 
        ApiResponse<Object> response = new ApiResponse<>(
            false,
            "Dữ liệu không hợp lệ",
            errors
        );
        return new ResponseEntity<> (response, HttpStatus.BAD_REQUEST);
    }

    // GENERAL ERROR (Xử lý tất cả các exception còn lại (500))
    // @ExceptionHandler(Exception.class)
    // public ResponseEntity<ApiError> handleGeneral(Exception ex) {
    //     ApiError error = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
    //             "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau!");

    //     // // Chỉ log lỗi thật, không trả stack trace về client
    //     ex.printStackTrace();
    //     return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    // }

    // dùng API Response
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex) {
        ApiResponse<Object> response = ApiResponse.error("Đã xảy ra lỗi hệ thống vui lòng thử lại!");
        // // Chỉ log lỗi thật, không trả stack trace về client
        ex.printStackTrace();
        ApiError error = new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR.value(), 
        "Internal Server Error",
        ex.getMessage() != null ? ex.getMessage() : "Đã xảy ra lỗi hệ thống"
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
