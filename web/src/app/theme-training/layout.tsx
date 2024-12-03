export default function VocabularyThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex justify-center pt-5">{children}</section>;
}
