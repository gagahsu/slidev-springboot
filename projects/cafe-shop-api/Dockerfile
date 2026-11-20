# 轉角咖啡線上商店後端（Docker ch04：多階段建置）

# 第一階段：用 JDK 把程式編譯成 jar
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
# 先只複製建置設定並下載套件：程式碼改了，這一層還能沿用快取
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon > /dev/null
COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# 第二階段：執行只需要 JRE 和 jar
FROM eclipse-temurin:21-jre
WORKDIR /app
# 不用 root 執行
RUN useradd --system --create-home shop && mkdir -p /app/uploads && chown shop /app/uploads
USER shop
COPY --from=build /src/build/libs/*.jar app.jar
# 上傳的圖片放這裡，compose 會掛上 Volume（Docker ch07）
ENV UPLOAD_DIR=/app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
