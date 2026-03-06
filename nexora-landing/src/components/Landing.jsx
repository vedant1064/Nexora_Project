import { motion } from "framer-motion";

export default function Landing() {

  return (

    <div className="bg-black text-white">

      {/* HERO */}

      <section className="py-32">

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-16 items-center">

          <div>

            <h1 className="text-7xl font-bold mb-6">
              AI automation infrastructure
            </h1>

            <p className="text-gray-400 text-xl">
              Automate conversations, workflows, and execution.
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl h-[350px]" />

        </div>

      </section>


      {/* BLOCK 1 */}

      <section className="py-32 border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-16 items-center">

          <div className="bg-white/5 border border-white/10 rounded-xl h-[350px]" />

          <div>

            <h2 className="text-5xl font-bold mb-6">
              Conversations become execution
            </h2>

            <p className="text-gray-400 text-xl">
              Nexora converts incoming messages into automated workflows.
            </p>

          </div>

        </div>

      </section>


      {/* BLOCK 2 */}

      <section className="py-32 border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-16 items-center">

          <div>

            <h2 className="text-5xl font-bold mb-6">
              Real-time decision engine
            </h2>

            <p className="text-gray-400 text-xl">
              AI detects intent and executes instantly.
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl h-[350px]" />

        </div>

      </section>


      {/* CTA */}

      <section className="py-32 border-t border-white/10 text-center">

        <h2 className="text-6xl font-bold mb-6">
          Start building with Nexora
        </h2>

        <button className="bg-indigo-500 px-8 py-4 rounded-xl text-lg">
          Get started
        </button>

      </section>


    </div>

  );

}