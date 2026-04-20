
import { DepartmentRepresentative } from "./types";
import placeholderData from "@/app/lib/placeholder-images.json";

const getPlaceholder = (id: string) => {
  return placeholderData.placeholderImages.find(img => img.id === id)?.imageUrl || "";
};

export const DEPARTMENT_REPRESENTATIVES: DepartmentRepresentative[] = [
  {
    branch: 'Electrical Engineering',
    name: 'Yatharth Pandey',
    year: '2025-2029',
    email: 'yatharthpandey8505@gmail.com',
    linkedin: 'https://www.linkedin.com/in/yatharth-pandey-6b5baa300?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    imageUrl: getPlaceholder('yatharth-photo'),
    message: "Feel free to reach out for any queries regarding Electrical department resources or course details!"
  },
  {
    branch: 'Information Technology',
    name: 'IT Student Body',
    year: '2023-2027',
    email: 'it-rep@nitsri.ac.in',
    linkedin: '#',
    imageUrl: getPlaceholder('it-rep-photo'),
    message: "We're here to help you navigate IT courses and projects."
  },
  {
    branch: 'Computer Science & Engineering',
    name: 'CSE Student Body',
    year: '2023-2027',
    email: 'cse-rep@nitsri.ac.in',
    linkedin: '#',
    imageUrl: getPlaceholder('cse-rep-photo'),
    message: "Join our coding circles and access the best CSE resources."
  }
];
