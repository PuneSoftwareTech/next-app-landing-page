"use client";
import { FC, useEffect, useState } from "react";
import Head from "next/head";
import Typography from "../atoms/Typography";
import { fetchAllTestimonials } from "@/APIS/testimonial.service";
import { FetchTestimonialResponse } from "@/util/interfaces/testimonial";
import Loader from "../atoms/Loader";
import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import PrimaryButton from "../atoms/PrimaryButton";

const TestimonialsPage: FC = () => {
  const [testimonials, setTestimonials] = useState<FetchTestimonialResponse[]>(
    []
  );
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const fetchData = async () => {
    try {
      const response = await fetchAllTestimonials();
      if (response?.success) {
        setTestimonials(response?.data);
      } else {
        setError("Failed to fetch testimonials.");
      }
    } catch (err) {
      setError("An error occurred while fetching testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    if (visibleCount >= testimonials.length) {
      setVisibleCount(3);
      return;
    }
    setVisibleCount((prevCount) => prevCount + 3);
  };

  if (loading) {
    return <Loader size="large" ariaLabel="loading-testimonials" />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold">{error}</div>
    );
  }

  return (
    <>
      {/* SEO Optimization */}
      <Head>
        <title>Testimonials - Pune Software Technologies</title>
        <meta
          name="description"
          content="Read what our students have to say about our courses at Pune Software Technologies."
        />
        <meta
          name="keywords"
          content="Pune Software Technologies, testimonials, student feedback, courses, training"
        />
      </Head>

      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 ">
        <Typography
          variant="h2"
          className="text-center text-3xl font-bold text-gray-900"
        >
          Testimonials
        </Typography>
        <div className="grid grid-cols-1  gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8  ">
          {testimonials?.length > 0 ? (
            testimonials.slice(0, visibleCount).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg px-6 py-4 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 border-l-4 border-violet-500"
              >
                <Typography
                  variant="h3"
                  className="text-lg font-semibold text-gray-800"
                >
                  {testimonial.name}
                </Typography>

                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(testimonial.star_ratings) ? (
                      <FaStar key={i} />
                    ) : i < testimonial.star_ratings ? (
                      <FaRegStarHalfStroke key={i} />
                    ) : (
                      <FaStar key={i} className="text-gray-300" />
                    )
                  )}
                </div>
                <Typography variant="p" className="text-gray-600 mt-2">
                  {expanded[testimonial.id]
                    ? testimonial.testimonial
                    : `${testimonial.testimonial.slice(0, 70)}...`}
                  {testimonial.testimonial.length > 70 && (
                    <button
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [testimonial.id]: !prev[testimonial.id],
                        }))
                      }
                      className="text-violet-500 mt-2 underline ml-2"
                    >
                      {expanded[testimonial.id] ? "Read Less" : "Read More"}
                    </button>
                  )}
                </Typography>
              </div>
            ))
          ) : (
            <Typography
              variant="p"
              className="text-center text-gray-600 col-span-full"
            >
              No testimonials available
            </Typography>
          )}
        </div>

        <div className="flex justify-center items-center mt-6">
          <PrimaryButton type="button" onClick={handleLoadMore}>
            {visibleCount < testimonials.length ? "Load More" : "Show Less"}
          </PrimaryButton>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPage;
