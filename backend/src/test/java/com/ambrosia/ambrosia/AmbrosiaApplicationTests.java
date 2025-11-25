package com.ambrosia.ambrosia;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
	"spring.datasource.url=jdbc:h2:mem:testdb",
	"spring.datasource.driverClassName=org.h2.Driver",
	"spring.datasource.username=sa",
	"spring.datasource.password=",
	"spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
	"jwt.secret=aVeryLongAndSecureSecretKeyForTestingJWTpurposes",
	"jwt.expiration.ms=3600000",
	"file.upload-dir=uploads",
	"supabase.url=http://localhost:8000",
	"supabase.key=dummy-key",
	"supabase.service-role-key=dummy-service-role-key"
})
class AmbrosiaApplicationTests {

	@Test
	void contextLoads() {
	}

}
