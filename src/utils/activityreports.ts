import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseAuth";
import jsPDF from "jspdf";

const generatePDFReport = async (userId: string, date: Date): Promise<Blob> => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const q = query(collection(db, "activities"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const activities = snapshot.docs
    .map((doc) => doc.data())
    .filter((activity: any) => {
      const actDate =
        activity.activityDate?.toDate?.() || new Date(activity.activityDate);
      return actDate >= startOfMonth && actDate <= endOfMonth;
    });

  // Count the activities by name
  const activityCountMap = new Map<
    string,
    { count: number; category: string; color: string }
  >();
  activities.forEach((activity: any) => {
    const activityName = activity.name;
    const category = activity.category;
    const currentActivity = activityCountMap.get(activityName);
    const color = activity.color;

    if (currentActivity) {
      currentActivity.count += 1; // Increment the count
    } else {
      activityCountMap.set(activityName, { count: 1, category, color }); // Add new entry with category
    }
  });

  const doc = new jsPDF();
  // Text to be centered
  const title = `Activity Report - ${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;

  // Get the width of the title text
  const titleWidth = doc.getTextWidth(title);

  // Calculate the x position to center the text
  const x = (doc.internal.pageSize.width - titleWidth) / 2;

  doc.text(title, x, 10);

  let y = 40;

  // Draw table headers
  doc.text("Activity", 10, y);
  doc.text("Count", 100, y);
  doc.text("Category", 150, y);
  y += 10;

  // Draw the table rows for activity counts
  activityCountMap.forEach((data, name) => {
    doc.setTextColor(data.color); // This changes the text color for the next text
    doc.text(name, 10, y);
    doc.text(data.count.toString(), 100, y);
    doc.text(data.category, 150, y);
    doc.setTextColor(0, 0, 0);
    y += 10;
  });

  return doc.output("blob");
};

export const useDownloadMonthlyReport = () => {
  const { user } = useAuth();

  const downloadMonthlyReport = async (selectedDate: Date) => {
    if (!user) return;

    const reportBlob = await generatePDFReport(user.uid, selectedDate);
    const url = URL.createObjectURL(reportBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Activity_Report_${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // optional cleanup
  };

  return downloadMonthlyReport;
};
