import React from 'react';
import TableView from './views/TableView';
import CardView from './views/CardView';
import ActivityView from './views/ActivityView';
import BadgeView from './views/BadgeView';

const ItemList = ({ appFields, appItems, view, handleFormOpen, setAppItems, appId }) => {
    return (
        <div>
            {view === 'table' && (
                <TableView
                    appFields={appFields}
                    appItems={appItems}
                    handleFormOpen={handleFormOpen}
                    setAppItems={setAppItems}
                    appId={appId}
                />
            )}
            {view === 'card' && (
                <CardView
                    appFields={appFields}
                    appItems={appItems}
                    handleFormOpen={handleFormOpen}
                    setAppItems={setAppItems}
                    appId={appId}
                />
            )}
            {view === 'activity' && (
                <ActivityView
                    appFields={appFields}
                    appItems={appItems}
                    handleFormOpen={handleFormOpen}
                    setAppItems={setAppItems}
                    appId={appId}
                />
            )}
            {view === 'badge' && (
                <BadgeView
                    appFields={appFields}
                    appItems={appItems}
                    handleFormOpen={handleFormOpen}
                    setAppItems={setAppItems}
                    appId={appId}
                />
            )}
        </div>
    );
};

export default ItemList;
