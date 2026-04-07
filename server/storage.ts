import { savedLocations, type SavedLocation, type InsertSavedLocation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getSavedLocations(): SavedLocation[];
  addSavedLocation(location: InsertSavedLocation): SavedLocation;
  removeSavedLocation(id: number): void;
}

export class DatabaseStorage implements IStorage {
  getSavedLocations(): SavedLocation[] {
    return db.select().from(savedLocations).all();
  }

  addSavedLocation(location: InsertSavedLocation): SavedLocation {
    return db.insert(savedLocations).values(location).returning().get();
  }

  removeSavedLocation(id: number): void {
    db.delete(savedLocations).where(eq(savedLocations.id, id)).run();
  }
}

export const storage = new DatabaseStorage();
