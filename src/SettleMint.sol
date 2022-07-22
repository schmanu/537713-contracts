// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SettleMint {
    event AddedOwner(address indexed account);
    event AddedMember(address indexed account);

    event NewExpense(address indexed payer, uint amount, address[] participants);

    /** Marker for first element in linked lists */
    address internal constant ADDRESS_GUARD = address(0x1);
    /** Token which this SettleMint uses to track debts */
    address public immutable token;
    /** Linked list of SettleMint members */
    mapping(address => address) internal members;

    /** Linked list of SettleMint owners */
    mapping(address => address) internal owners;

    mapping(address => int) public balances;

    uint public totalExpense = 0;

    uint ownerLength;

    struct Member {
        address account;
        uint balance;
    }

    modifier onlyOwners() {
        require(owners[msg.sender] != address(0), "Can only be called by owner");
        _;
    }

    modifier onlyMembers() {
        require(members[msg.sender] != address(0), "Can only be called by members");
        _;
    }

    constructor(address _token, address[] memory _members) {
        token = _token;

        // Initializing SettleMint members.
        address currentMember = ADDRESS_GUARD;
        // Fill linked list of members
        for (uint256 i = 0; i < _members.length; i++) {
            address member = _members[i];
            require(member != address(0) && member != ADDRESS_GUARD && member != address(this) && member != currentMember, "Invalid member");
            // No duplicate owners allowed.
            require(members[member] == address(0), "No duplicate members");
            members[currentMember] = member;
            currentMember = member;
            balances[member] = 0;
            emit AddedMember(member);
        }
        // The last member points to the guard
        members[currentMember] = ADDRESS_GUARD;

        // initially there is only one owner
        owners[ADDRESS_GUARD] = msg.sender;
        owners[msg.sender] = ADDRESS_GUARD;
        ownerLength = 1;

        emit AddedOwner(msg.sender);
    }

    function isMember(address _member) public view returns (bool) {
        return _member != ADDRESS_GUARD && members[_member] != address(0);
    }

    function isOwner(address _owner) public view returns (bool) {
        return _owner != ADDRESS_GUARD && owners[_owner] != address(0);
    }

    function addMember(address _member) public onlyOwners {
        require(members[_member] == address(0) && _member != ADDRESS_GUARD && _member != address(this), "Invalid member");

        // append in the front of linked list
        members[_member] = members[ADDRESS_GUARD];
        members[ADDRESS_GUARD] = _member;
        balances[_member] = 0;
        emit AddedMember(_member);
    }

    function removeMember(address _member) public onlyOwners {
        require(members[_member] != address(0), "Address must be a member");
        require(balances[_member] == 0, "Cannot remove unsettled member");
        
        // find previous member
        address startAddress = members[_member];
        address previousAddress = members[_member];
        while(members[previousAddress] != _member) {
            previousAddress = members[previousAddress];
            require(previousAddress != startAddress, "Error while removing member");
        }

        members[previousAddress] = startAddress;
        members[_member] = address(0);
    }

    function addOwner(address _owner) public onlyOwners {
        require(owners[_owner] == address(0) && _owner != ADDRESS_GUARD && _owner != address(this), "Invalid owner");

        // append in the front of linked list
        owners[_owner] = owners[ADDRESS_GUARD];
        owners[ADDRESS_GUARD] = _owner;
        ownerLength++;
        emit AddedOwner(_owner);
    }

    function removeOwner(address _owner) public onlyOwners {
        require(owners[_owner] != address(0), "Address must be a owner");
        require(ownerLength > 1, "Cannot remove the last owner");
        
        // find previous owner
        address startAddress = owners[_owner];
        address previousAddress = owners[_owner];
        while(owners[previousAddress] != _owner) {
            previousAddress = owners[previousAddress];
            require(previousAddress != startAddress, "Error while removing owner");
        }

        owners[previousAddress] = startAddress;
        owners[_owner] = address(0);
        ownerLength--;
    }

    /**
     * Adds expense paid by payer split evenly among participants.
     * Participants addresses need to be in ascending order.
     */
    function addExpense(uint amount, address payer, address[] memory _participants) public onlyMembers {
        uint participantsCount = _participants.length;
        uint residue = amount % participantsCount;
        uint share = amount / participantsCount;

        require(isMember(payer), "Payer must be a member");

        // Payer's balance increases by amount
        _adjustBalance(int(amount), payer);

        address lastParticipant = address(0);

        for (uint256 i = 0; i < _participants.length; i++) {
            address participant = _participants[i];
            require(isMember(participant), "Participant must be a member");
            require(lastParticipant < participant, "Participants need to be unique in increasing order!");
            lastParticipant = participant;

            if (residue > 0) {
                _adjustBalance(- int(share + 1), participant);
                residue--;
            } else {
              _adjustBalance(- int(share), participant);
            }
        }
        totalExpense = totalExpense + amount;
        emit NewExpense(payer, amount, _participants);
    }

    function _adjustBalance(int amount, address account) internal onlyMembers {
        int oldBalance = balances[account];
        balances[account] = oldBalance + amount;
    }
}
