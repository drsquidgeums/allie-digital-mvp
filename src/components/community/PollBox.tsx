
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const PollBox = () => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({
    "Morning": 12,
    "Afternoon": 8,
    "Evening": 15,
    "Night": 10
  });

  const handleVote = () => {
    if (!selectedOption) {
      toast({
        title: "Please select an option",
        variant: "destructive"
      });
      return;
    }

    setVotes(prev => ({
      ...prev,
      [selectedOption]: prev[selectedOption] + 1
    }));
    setHasVoted(true);
    toast({
      title: "Vote submitted!",
      description: "Thank you for participating in the poll."
    });
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Community Poll</h2>
      <p className="text-muted-foreground mb-4">When do you prefer to study?</p>

      {!hasVoted ? (
        <div className="space-y-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {Object.keys(votes).map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button onClick={handleVote} className="w-full mt-4">
            Submit Vote
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(votes).map(([option, count]) => (
            <div key={option} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{option}</span>
                <span>{Math.round((count / totalVotes) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(count / totalVotes) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-sm text-muted-foreground text-center mt-4">
            Total votes: {totalVotes}
          </p>
        </div>
      )}
    </Card>
  );
};
