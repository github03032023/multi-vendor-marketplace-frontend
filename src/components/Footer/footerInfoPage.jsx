import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import aboutImage from '../../assets/images/AboutUS.jpg';
import contactImage from '../../assets/images/contact-us.jpg';
import cancelImage from '../../assets/images/Cancelled3.jpg';
import termsImage from '../../assets/images/Terms3.jpg';
import privacyImage from '../../assets/images/laptop-with-padlock.jpg';
import helpImage from '../../assets/images/faqs-customer-service.jpg';

const FooterInfoPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const Section = ({ id, img, title, children, reverse, animation }) => (
    <section id={id} className="mb-5 py-4 border-bottom border-2" data-aos={animation}>
      <div className={`row align-items-center ${reverse ? 'flex-md-row-reverse' : ''}`}>
        <div className="col-md-6 mb-4 mb-md-0">
          <img src={img} alt={title} className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6">
          <div className="p-3 bg-light rounded shadow-sm h-100">
            <h4 className="text-success mb-3">{title}</h4>
            {children}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center text-primary fw-bold" data-aos="fade-down">SmartBuy Information</h2>

      <Section
        id="about"
        img={aboutImage}
        title="About Us"
        animation="fade-up"
      >
        <p>
          Welcome to <strong>SmartBuy</strong> — your one-stop online destination for everything!
          From tech to fashion to home décor, we bring trusted vendors and eager shoppers together in a secure, seamless, and joyful experience.
        </p>
        <ul>
          <li>✅ Curated listings from verified sellers</li>
          <li>✅ Secure payments & fast delivery</li>
          <li>✅ Hassle-free returns</li>
          <li>✅ Dedicated customer support</li>
        </ul>
      </Section>

      <Section
        id="contact"
        img={contactImage}
        title="Contact Us"
        animation="fade-up-right"
        reverse
      >
        <p>Need help? We’re just a call or email away:</p>
        <ul>
          <li><strong>Email:</strong> support@smartbuy.in</li>
          <li><strong>Phone:</strong> +91-98765-43210</li>
          <li><strong>Hours:</strong> Mon–Sat, 9 AM–7 PM</li>
        </ul>
        <address className="fw-light">
          SmartBuy Marketplace Pvt Ltd,<br />
          123, Digital Hub Lane,<br />
          Bengaluru, Karnataka 560001, India
        </address>
      </Section>

      <Section
        id="cancellation"
        img={cancelImage}
        title="Cancellation & Returns"
        animation="fade-up-left"
      >
        <ul>
          <li><strong>Cancel:</strong> Orders can be canceled before shipping.</li>
          <li><strong>Returns:</strong> Within 5 days of delivery on eligible items.</li>
          <li><strong>Refunds:</strong> Processed in 5–7 business days post verification.</li>
        </ul>
        <p className="fst-italic">For item-specific return rules, visit our Help section.</p>
      </Section>

      <Section
        id="terms"
        img={termsImage}
        title="Terms of Use"
        animation="zoom-in"
        reverse
      >
        <ul>
          <li>✅ Respect fellow users and sellers</li>
          <li>✅ No illegal or fraudulent activity</li>
          <li>✅ Prices and availability may change</li>
          <li>✅ Keep your account details secure</li>
        </ul>
        <p>These policies protect both shoppers and sellers alike.</p>
      </Section>

      <Section
        id="privacy"
        img={privacyImage}
        title="Privacy Policy"
        animation="fade-up"
      >
        <ul>
          <li>🔒 Minimal data collected for services</li>
          <li>🔒 End-to-end encryption</li>
          <li>🔒 Full control over your data</li>
        </ul>
        <p>Your privacy is our promise — transparency and trust are our core values.</p>
      </Section>

      <Section
        id="help"
        img={helpImage}
        title="Help & Support"
        animation="fade-up"
        reverse
      >
        <p>Explore our most popular help topics:</p>
        <ul>
          <li>📦 Order tracking</li>
          <li>❌ Cancellations and returns</li>
          <li>💳 Secure payments</li>
          <li>⚠️ Seller/product complaints</li>
        </ul>
        <p>Still need help? Email us at <a href="mailto:smartbuymarketplace@gmail.com">smartbuymarketplace@gmail.com</a> or call our helpline.</p>
      </Section>
    </div>
  );
};

export default FooterInfoPage;
