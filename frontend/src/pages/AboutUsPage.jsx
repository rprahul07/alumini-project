import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

// Placeholder for team members - we can create a dedicated component later if needed
const TeamMemberCard = ({ name, role, imageUrl }) => (
  <div className="text-center">
    <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" />
    <h3 className="text-xl font-bold text-gray-800">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Slide 1: The Mission */}
      <section 
        className="h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1200')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <motion.div 
          className="z-10 text-center text-white p-4 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
            Who are we?
          </h1>
          <p className="text-lg md:text-xl">
            We are a lifelong community of thinkers, leaders, and innovators, united by a shared history and a commitment to shaping a better future. The Alumni Association is the bridge that connects your past with your present and future.
          </p>
        </motion.div>
      </section>

      {/* Slide 2: The Journey (Timeline) */}
      <AnimatedSection>
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-16">
              How did our story begin?
            </h2>
            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 w-1 bg-gray-200 h-full -translate-x-1/2"></div>
              
              {/* Timeline Item 1 */}
              <div className="flex justify-center items-center mb-16">
                <div className="w-full md:w-1/2 text-right pr-8">
                  <h3 className="text-2xl font-bold text-blue-600">1965</h3>
                  <p className="mt-2 text-gray-600">Our college was founded with a pioneering class of just 50 students and a bold vision for education.</p>
                </div>
                <div className="absolute left-1/2 w-6 h-6 bg-blue-600 rounded-full -translate-x-1/2 border-4 border-white"></div>
              </div>
              
              {/* Timeline Item 2 */}
              <div className="flex justify-center items-center mb-16 flex-row-reverse">
                <div className="w-full md:w-1/2 text-left pl-8">
                  <h3 className="text-2xl font-bold text-blue-600">1980</h3>
                  <p className="mt-2 text-gray-600">The Alumni Association was officially formed to foster a lasting bond between graduates and the college.</p>
                </div>
                <div className="absolute left-1/2 w-6 h-6 bg-blue-600 rounded-full -translate-x-1/2 border-4 border-white"></div>
              </div>

              {/* Timeline Item 3 */}
               <div className="flex justify-center items-center mb-16">
                <div className="w-full md:w-1/2 text-right pr-8">
                  <h3 className="text-2xl font-bold text-blue-600">2005</h3>
                  <p className="mt-2 text-gray-600">A major milestone! We celebrated our 10,000th graduate, expanding our global network of alumni.</p>
                </div>
                <div className="absolute left-1/2 w-6 h-6 bg-blue-600 rounded-full -translate-x-1/2 border-4 border-white"></div>
              </div>

               {/* Timeline Item 4 */}
              <div className="flex justify-center items-center flex-row-reverse">
                <div className="w-full md:w-1/2 text-left pl-8">
                  <h3 className="text-2xl font-bold text-blue-600">Today</h3>
                  <p className="mt-2 text-gray-600">With over 50,000 alumni worldwide, we launch Alumni Connect to bring our community closer than ever before.</p>
                </div>
                <div className="absolute left-1/2 w-6 h-6 bg-blue-600 rounded-full -translate-x-1/2 border-4 border-white"></div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Slide 3: Meet the Team */}
      <AnimatedSection>
        <section className="py-20 px-4 bg-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
              Who leads the charge?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              <TeamMemberCard name="Olivia Chen" role="Director of Alumni Relations" imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800" />
              <TeamMemberCard name="Benjamin Carter" role="Events Coordinator" imageUrl="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800" />
              <TeamMemberCard name="Sophia Rodriguez" role="Community Manager" imageUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800" />
            </div>
          </div>
        </section>
      </AnimatedSection>
      
      {/* Slide 4: Our Vision */}
      <AnimatedSection>
        <section className="py-20 px-4 bg-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Where are we going next?
            </h2>
            <p className="text-lg md:text-xl">
              Our vision is to build the most engaged and supportive alumni network in the world. We are committed to providing lifelong value to every member of our community through continuous learning, networking, and mentorship opportunities.
            </p>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default AboutUsPage;