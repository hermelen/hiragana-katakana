export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex justify-center pt-5">{children}</section>;
}