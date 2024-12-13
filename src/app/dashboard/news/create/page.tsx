import NewsForm from "@/components/news/news-form";

export default function CreateNewsPage() {
  return (
    <div className="container mx-auto py-10 px-6">
      <NewsForm news={undefined} />
    </div>
  );
}
