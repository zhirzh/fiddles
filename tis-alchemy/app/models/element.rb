class Element < ActiveRecord::Base
  def self.made_of(one, two)
    return find_by(two:two, one:one) || find_by(two:one ,one:two)
  end
end
