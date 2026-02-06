import { TITLES } from "@/lib/constants";

export default function SectionDivider() {
  return (
    <div className="flex justify-center my-7 md:my-12">
      <div
        style={{
          background: TITLES,
          opacity: 0.13,
          height: 1,
          borderRadius: 2,
          width: "46vw",
          maxWidth: 540,
        }}
      />
    </div>
  );
}
