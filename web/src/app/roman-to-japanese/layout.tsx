export default function SyllabaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex justify-center pt-5">{children}</section>;
}
