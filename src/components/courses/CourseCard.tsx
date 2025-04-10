import React from "react";
import Link from "next/link";
import { FiClock, FiBarChart2, FiEdit, FiTrash2 } from "react-icons/fi";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  moduleCount: number;
  onDelete?: (id: string) => void;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  difficulty,
  estimatedTime,
  moduleCount,
  onDelete,
}) => {
  return (
    <Card hoverable className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{estimatedTime} min</span>
          </div>
          <div className="flex items-center">
            <FiBarChart2 className="mr-1" />
            <span>{moduleCount} modules</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
        <Link href={`/courses/${id}`} passHref>
          <Button variant="primary" size="sm">
            View Course
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Link href={`/courses/${id}/edit`} passHref>
            <Button variant="outline" size="sm" leftIcon={<FiEdit />}>
              Edit
            </Button>
          </Link>
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<FiTrash2 />}
              onClick={() => onDelete(id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
