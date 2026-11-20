# 轉角咖啡線上商店後端（Docker ch04：多階段建置）

# ---- 第一階段：用 JDK 編譯，本機不需要裝 JDK ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
# 先只複製 Gradle 設定並下載依賴：只改 Java 檔時，這一層會吃快取
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon > /dev/null
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test

# ---- 第二階段：只留 JRE 跟打包好的 jar ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# 不用 root 執行；uploads 先建好並交給 app，掛上 Volume 後 app 才寫得進去（Docker ch07）
RUN addgroup -S app && adduser -S app -G app && mkdir uploads && chown app:app uploads
COPY --from=build /src/build/libs/*.jar app.jar
USER app
# 預設用正式設定（沒有模擬付款）；上傳的圖片放 /app/uploads
ENV SPRING_PROFILES_ACTIVE=prod
ENV UPLOAD_DIR=/app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
