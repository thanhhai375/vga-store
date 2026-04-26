
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashChecker {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashInSql = "$2a$10$X4owgxMfcjQKFwlLZ3cK/ehRElF3uwzn0b1KrvPa6LrQZPgj.Gqmi";
        boolean matches = encoder.matches("123", hashInSql);
        System.out.println("Matches '123': " + matches);
        
        System.out.println("New hash for '123': " + encoder.encode("123"));
    }
}
