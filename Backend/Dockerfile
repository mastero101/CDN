# Utilizar una imagen base de Node.js
FROM node:alpine

# Crear un directorio de trabajo en la imagen
WORKDIR /

# Copiar los archivos necesarios a la imagen
COPY package.json .
COPY app.js .

# Instalar las dependencias de la aplicación
RUN npm install --only=production

# Exponer el puerto 1001 en la imagen
EXPOSE 1001

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["node", "app.js"]