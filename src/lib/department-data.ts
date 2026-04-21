
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
    linkedin: 'https://www.linkedin.com/in/yatharth-pandey-6b5baa300',
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
  },
  {
    branch: 'Mechanical Engineering',
    name: 'Mechanical Student Body',
    year: '2023-2027',
    email: 'mech-rep@nitsri.ac.in',
    linkedin: '#',
    imageUrl: getPlaceholder('mech-rep-photo'),
    message: "Coordinating resources for thermodynamics, fluid mechanics, and manufacturing tech."
  },
  {
    branch: 'Chemical Engineering',
    name: 'Chemical Student Body',
    year: '2023-2027',
    email: 'chem-rep@nitsri.ac.in',
    linkedin: '#',
    imageUrl: getPlaceholder('chem-rep-photo'),
    message: "Access curated notes for mass transfer, heat transfer, and process control."
  },
  {
    branch: 'Civil Engineering',
    name: 'Civil Student Body',
    year: '2023-2027',
    email: 'civil-rep@nitsri.ac.in',
    linkedin: '#',
    imageUrl: getPlaceholder('civil-rep-photo'),
    message: "Everything from structural analysis to geotechnical engineering resources."
  },
  {
    branch: 'Electronics & Communication Engineering',
    name: 'ECE Student Body',
    year: '2023-2027',
    email: 'ece-rep@nitsri.ac.in',
    linkedin: '#',
    imageUrl: getPlaceholder('ece-rep-photo'),
    message: "Connecting you with quality materials for digital electronics and signals."
  },
  {
    branch: 'Metallurgical & Materials Engineering',
    name: 'Metallurgy Student Body',
    year: '2023-2027',
    email: 'meta-rep@nitsri.ac.in',
    linkedin: '#',
    imageUrl: getPlaceholder('meta-rep-photo'),
    message: "Your source for extractive metallurgy and material science notes."
  }
];
