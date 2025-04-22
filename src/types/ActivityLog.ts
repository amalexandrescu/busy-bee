import { Category } from "../components/constants/categories";
import { Timestamp } from "firebase/firestore";

export interface ActivityLog {
  name: string;
  category: Category;
  color: string;
  createdAt: Date | Timestamp;
}

export interface ActivityLog {
  name: string;
  category: Category;
  color: string;
  createdAt: Date | Timestamp;
}
