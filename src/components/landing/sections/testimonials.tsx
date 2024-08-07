import Image, { type StaticImageData } from "next/image";

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
    <div className="flex w-full items-center justify-center bg-orange-100 py-8">
      <div className="flex w-full max-w-5xl flex-col items-center gap-24 p-8">
        <h1 className="w-full text-center text-6xl font-semibold">
          What our users say
        </h1>
        <div className="grid w-full grid-cols-1 items-end gap-12 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <TestimonialBox
              key={`testimonial-${idx}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialBox({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex w-full flex-col justify-between gap-6">
      <div className="relative items-end rounded-lg bg-white p-4 shadow-lg">
        <p className="text-lg italic text-black">{testimonial.text}</p>
        <div className="absolute left-8 top-full h-0 w-0 border-x-[10px] border-t-[10px] border-x-transparent border-t-white"></div>
      </div>
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

      <div></div>
      {/* 
  
  <div className="flex items-center mt-4">
    <img src="https://via.placeholder.com/40" alt="Profile picture" className="rounded-full w-10 h-10">
    <div className="ml-3">
      <p className="font-bold">Danielle Cuddie</p>
      <p className="text-sm text-gray-500">Velocity Printing</p>
    </div>
  
</div> */}
    </div>
  );
}
