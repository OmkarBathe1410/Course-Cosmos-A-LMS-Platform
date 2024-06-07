import { styles } from "../../../app/styles/style";
import { useGetLayoutDataQuery } from "../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import Loader from "../Loader/Loader";

type Props = {};

const FAQ = () => {
  const { data, isLoading } = useGetLayoutDataQuery("FAQ", {});
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    if (data) {
      setQuestions(data?.layout?.faq);
    }
  }, [data]);

  const toggleQuestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto">
          <h1 className={`${styles.title} sm:!text-[2rem] lg:!text-[2.2rem]`}>
            Frequently Asked Questions
          </h1>
          <div className="mt-12">
            <dl className="space-y-8">
              {questions.map((q: any) => (
                <div
                  key={q._id}
                  className={`${
                    q._id !== questions[0]?._id && "border-t"
                  } border-gray-200 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      className="flex items-start text-black dark:text-white justify-between w-full text-left focus:outline-none"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <span className="font-medium text-black dark:text-white">
                        {q.question}
                      </span>
                      <span className="ml-6 flex-shrink-0">
                        {activeQuestion === q._id ? (
                          <HiMinus className="h-6 w-6" />
                        ) : (
                          <HiPlus className="h-6 w-6" />
                        )}
                      </span>
                    </button>
                  </dt>
                  {activeQuestion === q._id && (
                    <dd className="mt-5 pr-12">
                      <p className="text-base font-Poppins text-black dark:text-white">
                        {q.answer}
                      </p>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <br />
            <br />
            <br />
          </div>
        </div>
      )}
    </>
  );
};

export default FAQ;
