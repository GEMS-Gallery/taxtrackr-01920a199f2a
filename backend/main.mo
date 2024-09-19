import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Option "mo:base/Option";

actor TaxPayerManager {
    public type TaxPayer = {
        tid: Text;
        firstName: Text;
        lastName: Text;
        address: Text;
    };

    private stable var taxPayerEntries : [(Text, TaxPayer)] = [];
    private var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

    system func preupgrade() {
        taxPayerEntries := Iter.toArray(taxPayers.entries());
    };

    system func postupgrade() {
        taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayerEntries.vals(), 0, Text.equal, Text.hash);
    };

    public func addTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async () {
        let newTaxPayer : TaxPayer = {
            tid = tid;
            firstName = firstName;
            lastName = lastName;
            address = address;
        };
        taxPayers.put(tid, newTaxPayer);
    };

    public query func getAllTaxPayers() : async [TaxPayer] {
        return Iter.toArray(taxPayers.vals());
    };

    public query func searchTaxPayer(tid: Text) : async ?TaxPayer {
        return taxPayers.get(tid);
    };

    public func updateTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async Bool {
        switch (taxPayers.get(tid)) {
            case (null) { false };
            case (?existingTaxPayer) {
                let updatedTaxPayer : TaxPayer = {
                    tid = tid;
                    firstName = firstName;
                    lastName = lastName;
                    address = address;
                };
                taxPayers.put(tid, updatedTaxPayer);
                true
            };
        };
    };

    public func deleteTaxPayer(tid: Text) : async Bool {
        switch (taxPayers.remove(tid)) {
            case (null) { false };
            case (?removedTaxPayer) { true };
        };
    };
}
