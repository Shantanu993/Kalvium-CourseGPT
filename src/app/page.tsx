import Link from "next/link";
import { FiArrowRight, FiBook, FiLayers, FiEdit3, FiCpu } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight"
              data-aos="fade-up"
            >
              Create Courses with <span className="text-indigo-600">AI</span>{" "}
              Assistance
            </h1>
            <p
              className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              CourseGPT helps educators and content creators build high-quality
              educational content in minutes, not hours. Transform your
              expertise into engaging learning experiences.
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="primary"
                  rightIcon={<FiArrowRight />}
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="mt-16 relative"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/images/hero-screenshot.png"
                alt="CourseGPT Platform Screenshot"
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900"
              data-aos="fade-up"
            >
              Powerful Features for Course Creation
            </h2>
            <p
              className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Everything you need to create professional educational content
              quickly and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <FiCpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Generation
              </h3>
              <p className="text-gray-600">
                Generate complete lessons, learning objectives, and activities
                with advanced AI technology.
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <FiLayers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Modular Organization
              </h3>
              <p className="text-gray-600">
                Organize your content into logical modules and lessons with
                intelligent sequencing.
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <FiEdit3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Interactive Editor
              </h3>
              <p className="text-gray-600">
                Fine-tune AI-generated content with our intuitive editing
                interface designed for educators.
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <FiBook className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Educational Templates
              </h3>
              <p className="text-gray-600">
                Start with professionally designed templates optimized for
                different learning contexts.
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md md:col-span-2 lg:col-span-1"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <FiLayers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Activities
              </h3>
              <p className="text-gray-600">
                Generate quizzes, discussions, assignments, and interactive
                exercises automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-white">
            Ready to transform your course creation process?
          </h2>
          <p className="mt-4 text-xl text-indigo-100 max-w-3xl mx-auto">
            Join thousands of educators who are saving time and creating better
            learning experiences.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                rightIcon={<FiArrowRight />}
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
