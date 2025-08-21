import "./site-footer.scss";
import { useAppContext } from "ContextAPI/AppContext";
const Footer = () => {
  const { instituteInfo } = useAppContext();

  return (
    <footer className="school-footer">
      <div className="container">
        <div className="row footer-content">
          <div className="col-12 col-md-4 footer-col mb-4 mb-md-0">
            <h3>যোগাযোগের ঠিকানা:</h3>
            <p>
              পেঁচুল হাই স্কুল,
              <br />
              পেঁচুল, শেরপুর, বগুড়া।
            </p>
            <p>
              <strong>মোবাইল:</strong>
              <br />
              ০১৭২৪৬২১৬২৮
            </p>
            <p>
              <strong>ইমেইল: </strong>
              <br />
              penchulhighschool2014@gmail.com
            </p>
          </div>

          <div className="col-12 col-md-4 footer-col mb-4 mb-md-0">
            <h3>দ্রুত লিঙ্কসমূহ:</h3>
            <ul>
              <li>
                <a href="#">শিক্ষা বোর্ড</a>
              </li>
              <li>
                <a href="#">ঢাকা শিক্ষা বোর্ড</a>
              </li>
              <li>
                <a href="#">মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, চট্টগ্রাম</a>
              </li>
              <li>
                <a href="#">শিক্ষা মন্ত্রণালয়</a>
              </li>
              <li>
                <a href="#">ব্যানবেইস</a>
              </li>
              <li>
                <a href="#">মাধ্যমিক ও উচ্চ শিক্ষা অধিদপ্তর</a>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-4 footer-col">
            <h3>আমাদের সম্পর্কে:</h3>
            <ul>
              <li>
                <a href="#">যোগাযোগ করুন</a>
              </li>
              <li>
                <a href="#">গোপনীয়তা নীতি</a>
              </li>
              <li>
                <a href="#">শর্তাবলী</a>
              </li>
              {/* <li><a href="#">About</a></li> */}
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-4 pt-3 border-top text-center">
          Copyright ©2025 পেঁচুল হাই স্কুল | Developed By{" "}
          <a target="_blank" href="https://nexasofts.com/">
            NexaSofts
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
