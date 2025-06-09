plugins {
	java
	id("org.springframework.boot") version "3.5.0"
	id("io.spring.dependency-management") version "1.1.7"
	id("com.github.node-gradle.node") version "7.0.1"  // 🆕 Added for React support
}

group = "com.itenas"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")

	// JWT dependencies (updated versions)
	implementation("io.jsonwebtoken:jjwt-api:0.12.3")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.3")

	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.mysql:mysql-connector-j")  // MySQL tetap digunakan
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

// 🆕 Node.js configuration for React
node {
	version.set("18.17.0")
	npmVersion.set("9.6.7")
	download.set(true)
	nodeProjectDir.set(file("frontend"))
}

// 🆕 Frontend build tasks
tasks.register<com.github.gradle.node.npm.task.NpmTask>("installFrontendDeps") {
	workingDir.set(file("frontend"))
	args.set(listOf("ci"))
	inputs.file("frontend/package-lock.json")
	outputs.dir("frontend/node_modules")
}

tasks.register<com.github.gradle.node.npm.task.NpmTask>("buildReact") {
	dependsOn("installFrontendDeps")
	workingDir.set(file("frontend"))
	args.set(listOf("run", "build"))
	inputs.dir("frontend/src")
	inputs.files("frontend/package.json", "frontend/package-lock.json")
	outputs.dir("frontend/build")
}

tasks.register<Copy>("copyReactBuild") {
	dependsOn("buildReact")
	from("frontend/build")
	into("src/main/resources/static")
}

// 🆕 Include React build in Spring Boot build
tasks.processResources {
	dependsOn("copyReactBuild")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

// 🆕 Development tasks
tasks.register("bootRunDev") {
	group = "application"
	description = "Run with dev profile"
	doLast {
		tasks.bootRun.get().systemProperty("spring.profiles.active", "dev")
	}
}

tasks.register<com.github.gradle.node.npm.task.NpmTask>("startReact") {
	dependsOn("installFrontendDeps")
	workingDir.set(file("frontend"))
	args.set(listOf("start"))
}

// 🆕 Production JAR configuration
tasks.bootJar {
	archiveFileName.set("iyip-platform.jar")
}

// 🆕 Clean task to include frontend
tasks.clean {
	delete("frontend/build")
	delete("frontend/node_modules")
}