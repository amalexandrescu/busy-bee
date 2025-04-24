import { Category } from "../components/constants/categories";
import { Timestamp } from "firebase/firestore";

export interface Activity {
  name: string;
  category: Category;
  activityDate: string;
  activityDateTimestamp: Timestamp;
  color: string;
  createdAt: Date | Timestamp;
  userId: string;
}
