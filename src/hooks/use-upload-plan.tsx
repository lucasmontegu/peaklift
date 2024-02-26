"use client"

import { ChangeEvent, useState } from "react";

type FormData = {
  file: string | null;
  start_date: Date;
  end_date: Date;
}

export default function useUploadPlan() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUploadImageFile = async (file: File) => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
    setImageUrl(base64);
  };

  const handleUploadFile = async (e: ChangeEvent) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    try {
      if (file.type.startsWith("image/")) {
        return await handleUploadImageFile(file);
      }
    } catch (error: any) {
      console.log("error", error)
    }
  };



  const onSubmit = (data: FormData) => {
    const { file, start_date, end_date } = data;
    const startDateStr = start_date ? new Date(start_date).toLocaleDateString() : "";
    const endDateStr = end_date ? new Date(end_date).toLocaleDateString() : "";

    if (imageUrl) {
      const data = new FormData();
      data.append("file", imageUrl);
      data.append("start_date", startDateStr);
      data.append("end_date", endDateStr);
      setLoading(true);

      fetch("/api/completion", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          setResponse(res);
          setIsSuccess(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError("Error al procesar el archivo");
          setIsSuccess(false);
          setLoading(false);
        })
        .finally(() => {
          setImageUrl(null);
          setLoading(false);
        })
    }
  }

  return {
    imageUrl,
    response,
    loading,
    handleUploadFile,
    onSubmit,
    isSuccess,
    error
  }
}