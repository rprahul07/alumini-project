import React from 'react';
import { motion } from 'framer-motion';
import AlumniProfileCard from '../components/AlumniProfileCard';
import AnimatedSection from '../components/AnimatedSection';

const HomePage = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen">
      {/* Slide 1: The Welcome Mat */}
      <section
        className="h-screen flex items-center justify-center bg-cover bg-center bg-fixed bg-hero-image"
      >
        {/* THIS IS THE OVERLAY. Adjust the opacity value to control the darkness.
            Common values: opacity-30, opacity-40, opacity-50, opacity-60
            Or, you can delete this div entirely to remove the overlay. */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <motion.div 
          className="z-10 text-center text-white p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
            Remember the late-night study sessions in the library?
          </h1>
          <button className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105">
            Rediscover Your Story
          </button>
        </motion.div>
      </section>

      {/* Slide 2: The Gallery of Memories */}
      <AnimatedSection>
        <section className="bg-gray-100 py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
              What were your golden days?
            </h2>
            <motion.div 
              className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800" alt="Graduation ceremony"/>
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800" alt="Students studying together"/>
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800" alt="College event"/>
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800" alt="College campus building"/>
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800" alt="Team huddle"/>
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800" alt="Lecture hall"/>
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1607237138185-e894ee31b2af?w=800" alt="Student on campus"/>
              <motion.img variants={itemVariants} className="rounded-lg shadow-lg break-inside-avoid" src="https://images.unsplash.com/photo-1562774053-701939374585?w=800" alt="College library"/>
            </motion.div>
            <button className="mt-12 px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900 transition duration-300">
              Explore the Full Gallery
            </button>
          </div>
        </section>
      </AnimatedSection>
      
      {/* Slide 3: Reconnect with Your Tribe */}
      <AnimatedSection>
        <section className="bg-white py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
              Who were the friends that became family?
            </h2>
            <motion.div 
              className="flex overflow-x-auto p-4 -mx-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={itemVariants}><AlumniProfileCard name="Jane Doe" year="2015" role="Software Engineer at Google" imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800" /></motion.div>
              <motion.div variants={itemVariants}><AlumniProfileCard name="John Smith" year="2012" role="Product Manager at Microsoft" imageUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800" /></motion.div>
              <motion.div variants={itemVariants}><AlumniProfileCard name="Emily White" year="2018" role="UX Designer at Apple" imageUrl="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800" /></motion.div>
              <motion.div variants={itemVariants}><AlumniProfileCard name="Michael Brown" year="2010" role="Founder & CEO" imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" /></motion.div>
              <motion.div variants={itemVariants}><AlumniProfileCard name="Sarah Green" year="2020" role="Data Scientist at Netflix" imageUrl="https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800" /></motion.div>
            </motion.div>
            <button className="mt-12 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">
              Find Your Batchmates
            </button>
          </div>
        </section>
      </AnimatedSection>

      {/* Slide 4: The Mentorship Bridge */}
      <AnimatedSection>
        <section className="bg-gray-800 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-12">
              Could you be the mentor you never had?
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <p className="text-xl leading-relaxed">
                  Our students are looking for guidance from someone who has walked the path before them. Your experience is invaluable. Share your knowledge, open doors, and help shape the next generation of leaders from our college.
                </p>
                <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">
                  Become a Mentor
                </button>
              </div>
              <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
                <blockquote className="text-lg italic">
                  "Having an alumni mentor gave me the confidence and clarity I needed to land my dream internship. It's a connection I'll treasure for my entire career."
                </blockquote>
                <cite className="block mt-4 not-italic font-semibold">- Alex Ray, Final Year Student</cite>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
      
      {/* Slide 5: Opportunities Await */}
      <AnimatedSection>
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
              Looking for the next big thing? Or the next big talent?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Post Jobs & Opportunities</h3>
                <p className="mb-4">Access a trusted network of skilled professionals. Share job openings, internships, and projects with fellow alumni and bright students.</p>
                <button className="px-6 py-2 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900 transition duration-300">Post an Opportunity</button>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Discover Passionate Talent</h3>
                <p className="mb-4">Find the brightest minds and the most passionate individuals right here. Browse the student directory to find your next great hire.</p>
                <button className="px-6 py-2 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900 transition duration-300">Discover Talent</button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Slide 6: Upcoming Events */}
      <AnimatedSection>
        <section className="bg-gray-100 py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
              Ready for a reunion?
            </h2>
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800" className="w-full h-48 object-cover" alt="Networking event"/>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Annual Alumni Gala</h3>
                  <p className="text-gray-600 mb-4">October 25, 2025</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">Learn More</button>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800" className="w-full h-48 object-cover" alt="Webinar"/>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Webinar: AI in 2025</h3>
                  <p className="text-gray-600 mb-4">November 12, 2025</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">Learn More</button>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800" className="w-full h-48 object-cover" alt="Homecoming"/>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Homecoming Weekend</h3>
                  <p className="text-gray-600 mb-4">December 5-7, 2025</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">Learn More</button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Slide 7: The Final Call to Action */}
      <AnimatedSection>
        <section className="bg-gray-800 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Your journey continues.
            </h2>
            <p className="text-xl mb-8">Let's connect.</p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-white text-gray-800 font-bold rounded-full hover:bg-gray-200 transition duration-300">Sign Up</button>
              <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">Login</button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;