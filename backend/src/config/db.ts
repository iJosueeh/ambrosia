import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "ambrosia",
        });
        console.log("Conectado a la Base de Datos de MongoDB");
    } catch (error) {
        console.error("Error al conectar a la Base de Datos de MongoDB:", error);
        process.exit(1);
    }
};