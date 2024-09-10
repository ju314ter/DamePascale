"use client";

import React from "react";
import Image from "next/image";
import { ContactForm } from "@/components/contact/contact-form";

const ContactPage = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-5 pt-[10vh]">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Image
          src="/illustrationhome-removebg-compressed.png"
          alt="Logo"
          width={300}
          height={300}
          className="transform scale-x-[-1]"
        />
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-5xl font-bold font-serif text-primary">
            Contactez moi !
          </h1>
          <p className="text-lg text-accent">
            Pour toute demande de réalisation custom ou autres questions.
          </p>
        </div>
      </div>
      <div className="flex w-full justify-center align-center mt-8">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
