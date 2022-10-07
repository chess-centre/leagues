import Heading from "~/components/core/heading";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Heading className="text-2xl font-bold text-primary-500">
        Hello World!
      </Heading>
      <Heading className="text-2xl font-bold text-primary-500">Primary</Heading>
      <Heading className="text-2xl font-bold text-accent-500">Accent</Heading>
    </div>
  );
}
