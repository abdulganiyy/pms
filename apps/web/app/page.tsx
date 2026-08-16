"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RoomTypeError } from "@/components/home/RoomTypeError";
import { RoomTypeSkeleton } from "@/components/home/RoomTypeSkeleton";
import { RoomTypesEmpty } from "@/components/home/RoomTypeEmpty";

export type AvailabilityFormValues = {
  checkIn: string;
  checkOut: string;
  totalGuests: number;
};

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const {
    data: rooms,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["booking-rooms"],
    queryFn: async function getRoomTypes() {
      const response = await axios.get("/api/booking/roomtype");

      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const fadeUp: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeIn = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const slideRight: Variants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const slideLeft: Variants = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const onSubmit = (form: HTMLFormElement) => {
    const formData = new FormData(form);

    const checkIn = formData.get("checkIn") as string;
    const checkOut = formData.get("checkOut") as string;
    const totalGuests = Number(formData.get("totalGuests"));

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      totalGuests: String(totalGuests),
    });

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-180 overflow-hidden bg-foreground text-background">
        <motion.img
          src="/logo.JPG"
          alt="Harbor House terrace overlooking the Mediterranean"
          initial={{
            scale: 1.12,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/15 to-foreground/30" />
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"
        >
          <a href="#top" className="font-serif text-2xl tracking-tight">
            City West Hotel<span className="text-accent">.</span>
          </a>
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="hidden items-center gap-8 text-xs uppercase tracking-[0.2em] md:flex"
            aria-label="Primary navigation"
          >
            <motion.a
              variants={fadeUp}
              href="#stay"
              className="transition-opacity hover:opacity-60"
            >
              Stay
            </motion.a>

            {/* <motion.a
              variants={fadeUp}
              href="#table"
              className="transition-opacity hover:opacity-60"
            >
              The table
            </motion.a> */}

            <motion.a
              variants={fadeUp}
              href="#place"
              className="transition-opacity hover:opacity-60"
            >
              The place
            </motion.a>
          </motion.nav>
          <div className="flex items-center gap-3">
            <motion.a
              href="#book"
              whileHover={{
                scale: 1.03,
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
              }}
              className="hidden border border-background/70 px-5 py-3 text-xs uppercase tracking-[0.18em] sm:block"
            >
              Book a stay
            </motion.a>
            <button
              className="p-2 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.header>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-20 flex flex-col gap-5 overflow-hidden border-y border-background/20 bg-foreground px-6 py-6 text-sm uppercase tracking-[0.18em] md:hidden"
            >
              <motion.a
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                href="#stay"
                onClick={() => setMenuOpen(false)}
              >
                Stay
              </motion.a>

              {/* <motion.a
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                href="#table"
                onClick={() => setMenuOpen(false)}
              >
                The table
              </motion.a> */}

              <motion.a
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                href="#place"
                onClick={() => setMenuOpen(false)}
              >
                The place
              </motion.a>

              <motion.a
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                href="#book"
                onClick={() => setMenuOpen(false)}
              >
                Book a stay
              </motion.a>
            </motion.nav>
          )}
        </AnimatePresence>
        <motion.div
          id="top"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 mx-auto flex min-h-147.5 max-w-7xl flex-col justify-end px-6 pb-14 lg:px-10 lg:pb-20"
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 text-xs uppercase tracking-[0.28em] text-accent"
          >
            A refined stay in the heart of Ikenne, Ogun State · Nigeria
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl lg:text-[9.5rem]"
          >
            Stay well
            <br />
            Rest deeply <em>Feel at home.</em>
          </motion.h1>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex max-w-md items-end justify-between border-t border-background/40 pt-4 text-sm leading-6 text-background/85"
          >
            <p>
              Comfortable rooms, warm hospitality,
              <br />
              and a peaceful setting.
            </p>

            <motion.a
              href="#stay"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 uppercase tracking-[0.16em] text-xs"
            >
              Explore
              <ArrowUpRight size={16} />
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        id="book"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 mx-auto -mt-8 max-w-6xl px-5"
      >
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e.currentTarget);
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="grid gap-px border border-border bg-border md:grid-cols-4"
        >
          {/* Check in */}
          <motion.label variants={fadeUp} className="bg-card p-5">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Check in
            </span>

            <span className="flex items-center gap-3 text-sm">
              <CalendarDays size={16} className="text-accent" />

              <input
                type="date"
                name="checkIn"
                className="w-full bg-transparent outline-none"
                required
              />
            </span>
          </motion.label>

          {/* Check out */}
          <motion.label variants={fadeUp} className="bg-card p-5">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Check out
            </span>

            <span className="flex items-center gap-3 text-sm">
              <CalendarDays size={16} className="text-accent" />

              <input
                type="date"
                name="checkOut"
                className="w-full bg-transparent outline-none"
                required
              />
            </span>
          </motion.label>

          {/* Guests */}
          <motion.label variants={fadeUp} className="bg-card p-5">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Guests
            </span>

            <span className="flex items-center gap-3 text-sm">
              <select
                name="totalGuests"
                className="w-full bg-transparent outline-none"
                defaultValue="2"
              >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
              </select>

              <ChevronDown size={16} className="text-accent" />
            </span>
          </motion.label>

          {/* Submit */}
          <motion.button
            type="submit"
            variants={fadeUp}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="bg-primary p-5 text-left text-xs uppercase tracking-[0.18em] text-primary-foreground transition-colors"
          >
            {submitted ? "We'll be in touch" : "Check availability"}

            <ArrowUpRight size={16} className="ml-2 inline" />
          </motion.button>
        </motion.form>
      </motion.section>

      <motion.section
        id="place"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.25,
        }}
        variants={staggerContainer}
        className="mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-10 lg:py-40"
      >
        <motion.div variants={slideRight}>
          <p className="mb-7 text-xs uppercase tracking-[0.25em] text-accent">
            01 · The place
          </p>
          <h2 className="max-w-lg font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-7xl">
            A peaceful escape in<em> Ikenne.</em>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-muted-foreground">
            Discover a welcoming hotel in Ikenne, Ogun State, where comfortable
            accommodation meets warm Nigerian hospitality. Whether you're
            visiting for business, a family stay, an event, or simply a quiet
            weekend away, our hotel gives you a comfortable place to relax and
            recharge.
          </p>
          {/* <motion.a
            href="#table"
            whileHover={{ x: 6 }}
            className="mt-8 inline-flex items-center gap-2 border-b border-primary pb-2 text-xs uppercase tracking-[0.18em]"
          >
            Discover Ikenne <ArrowUpRight size={16} />
          </motion.a> */}
        </motion.div>
        <motion.img
          variants={slideLeft}
          src="/logo.JPG"
          alt="The Harbor House dining room"
          whileHover={{
            scale: 1.02,
          }}
          transition={{
            duration: 0.6,
          }}
          className="aspect-4/3 w-full object-cover"
        />
      </motion.section>

      <section id="stay" className="bg-secondary px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-accent">
                02 · Stay awhile
              </p>
              <h2 className="font-serif text-5xl tracking-[-0.03em] sm:text-7xl">
                Rooms made for comfort.
              </h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block">
              Comfortable rooms / One welcoming stay
            </span>
          </motion.div>
          <motion.div
            initial="hidden"

            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Loading */}
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <RoomTypeSkeleton key={i} />
              ))}

            {/* Error */}
            {!isLoading && isError && (
              <div className="md:col-span-3">
                <RoomTypeError onRetry={() => refetch()} />
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && rooms.length === 0 && (
              <div className="md:col-span-3">
                <RoomTypesEmpty />
              </div>
            )}

            {/* Success */}
            {!isLoading &&
              !isError &&
              rooms.length > 0 &&
              rooms.map((room: any, i: number) => (
                <motion.article
                  key={room.id}
                  variants={fadeUp}
                  className="group"
                >
                  <div className="overflow-hidden bg-muted">
                    <motion.img
                      src={room.image}
                      alt={room.name}
                      whileHover={{
                        scale: 1.06,
                      }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="aspect-4/5 w-full object-cover"
                    />
                  </div>

                  <div className="flex items-start justify-between border-b border-border py-5">
                    <div>
                      <h3 className="font-serif text-2xl">{room.name}</h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {room.detail}
                      </p>
                    </div>

                    <p className="text-xs uppercase tracking-[0.12em] text-accent">
                      {room.price}
                    </p>
                  </div>

                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}

                    <span className="ml-4">
                      View room{" "}
                      <ArrowUpRight size={14} className="ml-1 inline" />
                    </span>
                  </p>
                </motion.article>
              ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        id="table"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.3,
        }}
        variants={staggerContainer}
        className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <motion.div variants={slideRight}>
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-accent">
              03 · Dining
            </p>

            <h2 className="max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-7xl">
              Good food. <em>Good company.</em>
            </h2>
          </motion.div>
          <motion.div variants={slideLeft} className="max-w-md lg:pb-2">
            <p className="text-sm leading-7 text-muted-foreground">
              Enjoy a relaxed dining experience featuring familiar Nigerian
              favourites, international dishes, refreshing drinks, and flavours
              prepared with care.
            </p>

            {/* <motion.a
              href="#book"
              whileHover={{ x: 6 }}
              className="mt-8 inline-flex items-center gap-2 border-b border-primary pb-2 text-xs uppercase tracking-[0.18em]"
            >
              Explore dining
              <ArrowUpRight size={16} />
            </motion.a> */}
          </motion.div>
        </div>
      </motion.section>
      <footer className="border-t border-border bg-primary px-6 py-10 text-primary-foreground lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-3xl">
              City West Hotel<span className="text-accent">.</span>
            </p>
            <p className="mt-3 text-xs text-primary-foreground/60">
              Ikenne, Ogun State · Nigeria
            </p>
          </div>
          <div className="flex gap-6 text-xs uppercase tracking-[0.16em] text-primary-foreground/70">
            {/* <a href="#book">Reservations</a> */}
            <a href="#place">Contact</a>
            <a href="#top">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
