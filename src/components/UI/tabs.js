import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext(null);

const Tabs = ({ defaultValue, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children, ...props }) => {
  return (
    <div 
      className={`flex space-x-1 rounded-md p-1 bg-gray-100 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, className, children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
        activeTab === value
          ? "bg-white shadow text-black"
          : "text-gray-600 hover:text-black"
      } ${className || ""}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return (
    <div
      className={`mt-2 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
