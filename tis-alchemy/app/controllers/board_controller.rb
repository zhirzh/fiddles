class BoardController < ApplicationController
	def winners
		@players=Player.all.order(score: :DESC)
	end

	def pokers
		puts request.url
		@pokers=[]
		File.open("#{Rails.root}/log/cheat.log",'r').each do |line|
			line=line.chomp!.split('---')
			if line[1]
				@pokers.append([Player.find_by_email(line[3]),line[2],line[1]])
			end
		end
	end

	def cheaters
		@players=Player.all
		@cheaters=[]
		@players.each do |p|
			if (p.elements_found.count('1')-4)*5 !=p.score
				@cheaters.append(p)
			end
		end
	end

	def losers
	end
end
