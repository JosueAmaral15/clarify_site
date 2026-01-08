import { useState } from 'react';
import { Link } from 'react-router-dom';
import newsletterService from '../services/newsletterService';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await newsletterService.subscribe(email);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setEmail(''); // Clear form on success
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Boost Your Productivity?
          </h2>
          
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Download Clarify and experience powerful text processing tools for your workflow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/download"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Download Clarify Free
            </Link>
            
            <Link
              to="/docs"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              View Documentation
            </Link>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Stay Updated
            </h3>
            <p className="text-blue-100 mb-6">
              Get notified about new features, updates, and tips.
            </p>
            
            <form 
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all transform hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            
            {/* Success/Error Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {message.text}
              </div>
            )}
            
            <p className="text-sm text-blue-200 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
