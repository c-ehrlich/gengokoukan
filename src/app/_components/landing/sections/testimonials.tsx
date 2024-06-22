import Image, { StaticImageData } from "next/image";

type Testimonial = {
  text: string;
  avatar?: StaticImageData;
  name: string;
  title: string;
};

const testimonials: Testimonial[] = [
  {
    text: "I'm too much of a pussy to talk to people on HelloTalk, so this is perfect for me.",
    name: "Some guy",
    title: "Some title",
  },
  {
    text: "Big Ball Mate",
    name: "Harry Hruz",
    title: "Wodonga, Victoria",
  },
  {
    text: "Better than my scam",
    name: "Matt vs Japan",
    title: "YouTube Sensation",
  },
];
export function Testimonials() {
  return (
    <div className="flex w-full flex-col items-center gap-8 bg-green-800 p-8">
      <p>TESTIMONIALS</p>
      <h3>What our users say</h3>
      <div className="flex w-full flex-row gap-12">
        {testimonials.map((testimonial, idx) => (
          <TestimonialBox
            key={`testimonial-${idx}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialBox({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-64 w-1/3 flex-col justify-between border border-white p-4">
      <p>{testimonial.text}</p>
      <div className="flex flex-col gap-2">
        <div className="h-24 w-24 overflow-clip rounded-full">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={`${testimonial.name}'s avatar`}
            />
          ) : (
            <div className="h-full w-full bg-yellow-500" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-bold">{testimonial.name}</p>
          <p>{testimonial.title}</p>
        </div>
      </div>
    </div>
  );
}
