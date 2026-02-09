interface ArticleContentProps {
  html: string
}

export function ArticleContent({ html }: ArticleContentProps) {
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-turbo-blue prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
