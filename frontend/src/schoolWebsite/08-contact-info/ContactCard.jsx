
// export default ContactCard;
import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import ImageModal from 'Components/full_screen_modal/ImageModal'
import { debugLog } from 'Components/debug/debug';

const API_URL = import.meta.env.VITE_API_URL;
const INSTITUTE_CODE = import.meta.env.VITE_INSTITUTE_CODE;

const ContactPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/contact-pages/${INSTITUTE_CODE}/`)
      .then((res) => res.json())
      .then((data) => {
        setPageData(data);
        setLoading(false);
        // console.log("data contact page : ", data);
      })
      .catch((err) => {
        console.error("Error fetching contact page:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></span>
      </div>
    );
  }

  if (!pageData) {
    return <p className="text-center text-gray-500 mt-10">No contact data found.</p>;
  }

  const {cards, institute_info } = pageData;

  // console.log("institute_info: ", institute_info);
  // console.log("cards: ", cards);
  // debugLog('Button clicked with some data cards:',cards);

  return (
    <div className="py-4 ">
      <div className="max-w-6xl 2xl:max-w-full mx-auto">
        {/* institute_info Header */}
        {institute_info && (
          <div className="text-center mb-12">
            {institute_info.logo_url && (
              <img
                src={institute_info.logo_url}
                alt={institute_info.name}
                className="mx-auto h-24 w-24 object-contain mb-4 rounded-2xl"
              />
            )}
            <h1 className="text-3xl font-bold text-blue-700">
              {institute_info.name}
            </h1>
            <p className="text-gray-600">{institute_info.address}</p>
          </div>
        )}

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {cards && cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow "
            >
              {/* Header */}
              {/* <div className="bg-blue-600 text-white px-4 py-2  flex justify-center font-semibold">
                <h4 className="pt-2"> {card.title}</h4>
              </div> */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 flex justify-center font-semibold">
                <h4 className="pt-2">{card.title}</h4>
              </div>

              <div className="p-6 space-y-4 ">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border bg-blue-100 flex items-center justify-center overflow-hidden">
                    
                    {card.contact_person.picture_cropped_url ? (
                      <span className="text-blue-700 font-bold text-lg hover:shadow-md">
                        {/* <img
                          src={card.contact_person.picture_cropped_url}
                          alt={card.contact_person.name}
                        /> */}

                        <ImageModal
                          image={card.contact_person.picture_cropped_url}
                          fullImage={card.contact_person.picture_url}  
                          altText={card.contact_person.name}
                        />
                        
                      </span>
                    ) : (
                      <span className="text-blue-700 font-bold text-lg">
                        {card.contact_person.name?.charAt(0) || "?"}
                      </span>
                    )}

                  </div>
                  {/* //////////// Name and Designation ////////////////////// */}
                  <div>
                    <h5 className="text-lg font-semibold">
                      {card.contact_person.bangla_name}
                    </h5>
                    {card.contact_person.designation_display && (
                      <p className="text-sm text-gray-500">
                        {card.contact_person.designation_bn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  {/* ///////////////////////////// Phone Number ///////////////////// */}
                  {card.contact_person.phone_number && (
                    <div className="flex items-center gap-2 border justify-between p-3 rounded-2xl hover:shadow-sm transition-all duration-300">
                      <div className="flex gap-1">
                        <Phone size={18} className="text-green-600" />
                        <span>{card.contact_person.phone_number}</span>
                      </div>

                      {card.contact_person.is_whatsapp && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                          <MessageCircle size={12} /> হোয়াটস্যাপ
                        </span>
                      )}
                    </div>
                  )}

                  {/* /////////////////// Email ////////////////////////// */}
                  {card.contact_person.email && (
                    <div className="flex items-center gap-2 border p-3 rounded-2xl hover:shadow-sm transition-all duration-300">
                      <Mail size={18} className="text-red-600" />
                      <span>{card.contact_person.email}</span>
                    </div>
                  )}

                  {/* ////////////// Addresss /////////////////// */}
                  {card.address && (
                    <div className="flex items-start gap-2 border p-3 rounded-2xl hover:shadow-sm transition-all duration-300">
                      <MapPin size={18} className="text-blue-600 mt-1" />
                      <span>{card.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
