import React from "react";
import UserProfile from "./UserProfile";
import UserBarterRequests from "./UserBarterRequests";
import UserBarterDeals from "./UserBarterDeals";

const AccountPage = () => {
    return (
        <div>
            <h1>Личный кабинет бартера</h1>
            <UserProfile />
            <UserBarterRequests />
            <UserBarterDeals />
        </div>
    );
};

export default AccountPage;
