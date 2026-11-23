<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:variable name="MILLISECONDS_PER_SECOND" select="1000"/>
	<xsl:variable name="HOTWIRE_CONVERSION_FACTOR" select="4"/>

	<xsl:template match="/sched">
		<sched id='' type='GTVII'>
			<head>
				<xsl:value-of select="./@head"/>
			</head>
			<numsegs>
				<xsl:value-of select="count(./segment)"/>
			</numsegs>
			<desc>
				<od>
					<xsl:value-of select="./description/outer_diameter"/>
				</od>
			</desc>
			<global>
				<prepurge>
					<xsl:value-of select="./global/prepurge"/>
				</prepurge>
				<postpurge>
					<xsl:value-of select="./global/postpurge"/>
				</postpurge>
				<initcur>
					<xsl:value-of select="./global/initial_amps"/>
				</initcur>
				<fincur>
					<xsl:value-of select="./global/final_amps"/>
				</fincur>
				<impcur>
					<xsl:value-of select="./global/impulse_amps"/>
				</impcur>
				<imptime>
					<xsl:value-of select="(./global/impulse_time * $MILLISECONDS_PER_SECOND)"/>
				</imptime>
				<travdel>
					<xsl:value-of select="./global/travel_delay"/>
				</travdel>
				<pretravel>
					<xsl:value-of select="./global/flying_start"/>
				</pretravel>
				<craterfill>
					<xsl:value-of select="./global/crater_fill_time"/>
				</craterfill>
				<travjog>
					<xsl:value-of select="./global/travel_jog"/>
				</travjog>
				<downslope>
					<xsl:value-of select="./global/downslope"/>
				</downslope>
				<!-- For GT7, 0, 1, -1 for manual, forward and reverse-->
				<!-- For GT6, 0, 1 for forward and reverse-->
				<xsl:choose>
					<xsl:when test="./travel_direction = '1'">
						<travdir>
							<xsl:value-of select="0"/>
						</travdir>
					</xsl:when>
					<xsl:when test="./travel_direction = '-1'">
						<travdir>
							<xsl:value-of select="1"/>
						</travdir>
					</xsl:when>
					<xsl:otherwise>
						<travdir>
							<xsl:value-of select="0"/>
						</travdir>
					</xsl:otherwise>
				</xsl:choose>
				<dlogmode>
					<xsl:value-of select="./global/datalog_mode"/>
				</dlogmode>
				<avcgap>
					<xsl:value-of select="./global/ahc_gap"/>
				</avcgap>
				<avcsens>
					<xsl:value-of select="./global/avc_sensitivity"/>
				</avcsens>
				<avchisens>
					<xsl:value-of select="./global/avc_high_sensitivity"/>
				</avchisens>
				<avcdeadband>
					<xsl:value-of select="./global/avc_deadband"/>
				</avcdeadband>
				<avcslowband>
					<xsl:value-of select="./global/avc_slowband"/>
				</avcslowband>
				<avcdelay>
					<xsl:value-of select="./global/ahc_delay"/>
				</avcdelay>
				<avcstop>
					<xsl:value-of select="./global/ahc_stop_delay"/>
				</avcstop>
				<avcretract>
					<xsl:value-of select="./global/ahc_retract"/>
				</avcretract>
				<avcjog>
					<xsl:value-of select="./global/ahc_jog"/>
				</avcjog>
				<wiredel>
					<xsl:value-of select="./global/wire_delay"/>
				</wiredel>
				<wireret>
					<xsl:value-of select="./global/wire_retract"/>
				</wireret>
				<wirejogfwd>
					<xsl:value-of select="./global/wire_jog_fwd"/>
				</wirejogfwd>
				<wirejogrev>
					<xsl:value-of select="./global/wire_jog_fwd"/>
				</wirejogrev>
				<wire2del>
					<xsl:value-of select="./global/wire2_delay"/>
				</wire2del>
				<wire2ret>
					<xsl:value-of select="./global/wire2_retract"/>
				</wire2ret>
				<wire2jogfwd>
					<xsl:value-of select="./global/wire2_jog_fwd"/>
				</wire2jogfwd>
				<wire2jogrev>
					<xsl:value-of select="./global/wire2_jog_fwd"/>
				</wire2jogrev>
				<initialwire>
					<xsl:value-of select="./global/initial_wire_speed"/>
				</initialwire>
				<hotwire>
					<xsl:value-of select="(./global/hotwire * $HOTWIRE_CONVERSION_FACTOR)"/>
				</hotwire>
				<oscjog>
					<xsl:value-of select="./global/osc_jog"/>
				</oscjog>
				<oscstep>
					<xsl:value-of select="./global/osc_step"/>
				</oscstep>
				<auxjog0>
					<xsl:value-of select="./global/aux0_jog"/>
				</auxjog0>
				<auxjog1>
					<xsl:value-of select="./global/aux1_jog"/>
				</auxjog1>
				<auxjog2>
					<xsl:value-of select="./global/aux2_jog"/>
				</auxjog2>
				<auxjog3>
					<xsl:value-of select="./global/aux3_jog"/>
				</auxjog3>
				<auxjog4>
					<xsl:value-of select="./global/aux4_jog"/>
				</auxjog4>
				<auxjog5>
					<xsl:value-of select="./global/aux5_jog"/>
				</auxjog5>
				<auxjog6>
					<xsl:value-of select="./global/aux6_jog"/>
				</auxjog6>
				<auxjog7>
					<xsl:value-of select="./global/aux7_jog"/>
				</auxjog7>
				<auxjog8>
					<xsl:value-of select="./global/aux8_jog"/>
				</auxjog8>
				<auxjog9>
					<xsl:value-of select="./global/aux9_jog"/>
				</auxjog9>
				<auxstep0>
					<xsl:value-of select="./global/aux0_step"/>
				</auxstep0>
				<auxstep1>
					<xsl:value-of select="./global/aux1_step"/>
				</auxstep1>
				<auxstep2>
					<xsl:value-of select="./global/aux2_step"/>
				</auxstep2>
				<auxstep3>
					<xsl:value-of select="./global/aux3_step"/>
				</auxstep3>
				<auxstep4>
					<xsl:value-of select="./global/aux4_step"/>
				</auxstep4>
				<auxstep5>
					<xsl:value-of select="./global/aux5_step"/>
				</auxstep5>
				<auxstep6>
					<xsl:value-of select="./global/aux6_step"/>
				</auxstep6>
				<auxstep7>
					<xsl:value-of select="./global/aux7_step"/>
				</auxstep7>
				<auxstep8>
					<xsl:value-of select="./global/aux8_step"/>
				</auxstep8>
				<auxstep9>
					<xsl:value-of select="./global/aux9_step"/>
				</auxstep9>
				<loopto>
					<xsl:value-of select="./global/loop_to"/>
				</loopto>
				<loopcount>
					<xsl:value-of select="./global/loop_count"/>
				</loopcount>
				<bbdelay>
					<xsl:value-of select="./global/burn_back_time"/>
				</bbdelay>
				<autohome>
					<xsl:value-of select="./global/travel_auto_home"/>
				</autohome>
				<trackdiam>
					<xsl:value-of select="./description/outer_diameter"/>
				</trackdiam>
				<workdiam>
					<xsl:value-of select="./segment[@index='0']/pipe_diameter"/>
				</workdiam>
				<migsens>
					<xsl:value-of select="./segment[@index='0']/mig_sensitivity"/>
				</migsens>
			</global>
			<limits>
				<priamperr>
					<xsl:value-of select="./limits/pri_amp_error"/>
				</priamperr>
				<priampflt>
					<xsl:value-of select="./limits/pri_amp_fault"/>
				</priampflt>
				<bkgamperr>
					<xsl:value-of select="./limits/bkg_amp_error"/>
				</bkgamperr>
				<bkgampflt>
					<xsl:value-of select="./limits/bkg_amp_fault"/>
				</bkgampflt>
				<traverr>
					<xsl:value-of select="./limits/travel_error"/>
				</traverr>
				<travflt>
					<xsl:value-of select="./limits/travel_fault"/>
				</travflt>
				<voltlow>
					<xsl:value-of select="./limits/voltage_low"/>
				</voltlow>
				<volthigh>
					<xsl:value-of select="./limits/voltage_high"/>
				</volthigh>
				<wireerr>
					<xsl:value-of select="./limits/wire_error"/>
				</wireerr>
				<wireflt>
					<xsl:value-of select="./limits/wire_fault"/>
				</wireflt>
			</limits>
			<overrides>
				<ampMax>
					<xsl:value-of select="./overrides/amp_max"/>
				</ampMax>
				<ampRate>
					<xsl:value-of select="./overrides/amp_rate"/>
				</ampRate>
				<travelMax>
					<xsl:value-of select="./overrides/travel_max"/>
				</travelMax>
				<travelRate>
					<xsl:value-of select="./overrides/travel_rate"/>
				</travelRate>
				<pulseFreqMax>
					<xsl:value-of select="./overrides/pulse_freq_override_max"/>
				</pulseFreqMax>
				<pulseFreqRate>
					<xsl:value-of select="./overrides/pulse_freq_override_rate"/>
				</pulseFreqRate>
				<pulseWidthMax>
					<xsl:value-of select="./overrides/pulse_width_override_max"/>
				</pulseWidthMax>
				<pulseWidthRate>
					<xsl:value-of select="./overrides/pulse_width_override_rate"/>
				</pulseWidthRate>
				<wireMax>
					<xsl:value-of select="./overrides/wire_max"/>
				</wireMax>
				<wireRate>
					<xsl:value-of select="./overrides/wire_rate"/>
				</wireRate>
				<wire2Max>
					<xsl:value-of select="./overrides/wire2_max"/>
				</wire2Max>
				<wire2Rate>
					<xsl:value-of select="./overrides/wire2_rate"/>
				</wire2Rate>
				<voltMax>
					<xsl:value-of select="./overrides/volt_max"/>
				</voltMax>
				<voltRate>
					<xsl:value-of select="./overrides/volt_rate"/>
				</voltRate>
				<oscWidthMax>
					<xsl:value-of select="./overrides/osc_width_max"/>
				</oscWidthMax>
				<oscWidthRate>
					<xsl:value-of select="./overrides/osc_width_rate"/>
				</oscWidthRate>
				<dwellMax>
					<xsl:value-of select="./overrides/dwell_max"/>
				</dwellMax>
				<dwellRate>
					<xsl:value-of select="./overrides/dwell_rate"/>
				</dwellRate>
				<excursionMax>
					<xsl:value-of select="./overrides/excursion_max"/>
				</excursionMax>
				<excursionRate>
					<xsl:value-of select="./overrides/excursion_rate"/>
				</excursionRate>
				<thetaMax>
					<xsl:value-of select="./overrides/theta_width_max"/>
				</thetaMax>
				<thetaRate>
					<xsl:value-of select="./overrides/theta_width_rate"/>
				</thetaRate>
			</overrides>
			<xsl:for-each select="./segment">
				<seg index="{./@index}">
					<segtime>
						<xsl:value-of select="./segment_time"/>
					</segtime>
					<slope>
						<xsl:value-of select="./slope"/>
					</slope>
					<priamp>
						<xsl:value-of select="./pri_amp"/>
					</priamp>
					<bkgamp>
						<xsl:value-of select="./bkg_amp"/>
					</bkgamp>
					<pulsefreq>
						<xsl:value-of select="./pulse_freq"/>
					</pulsefreq>
					<pulsewidth>
						<xsl:value-of select="./pulse_width"/>
					</pulsewidth>
					<pritrav>
						<xsl:value-of select="./pri_travel"/>
					</pritrav>
					<bkgtrav>
						<xsl:value-of select="./bkg_travel"/>
					</bkgtrav>
					<priwire>
						<xsl:value-of select="./pri_wire"/>
					</priwire>
					<bkgwire>
						<xsl:value-of select="./bkg_wire"/>
					</bkgwire>
					<priwire2>
						<xsl:value-of select="./pri_wire2"/>
					</priwire2>
					<bkgwire2>
						<xsl:value-of select="./bkg_wire2"/>
					</bkgwire2>
					<privolt>
						<xsl:value-of select="./pri_ahc"/>
					</privolt>
					<bkgvolt>
						<xsl:value-of select="./bkg_ahc"/>
					</bkgvolt>
					<avcmode>
						<xsl:value-of select="./avc_mode"/>
					</avcmode>
					<!-- For GT7, 0, 1, 2, 3 for disabled, arc sync, no sync, and osc sync-->
					<!-- For GT6, 0, 1, 2 for disabled, parc and sync-->
					<xsl:choose>
						<xsl:when test="./sync_mode = '3'">
							<pulsemode>
								<xsl:value-of select="2"/>
							</pulsemode>
						</xsl:when>
						<xsl:when test="./sync_mode = '2'">
							<pulsemode>
								<xsl:value-of select="0"/>
							</pulsemode>
						</xsl:when>
						<xsl:otherwise>
							<pulsemode>
								<xsl:value-of select="./sync_mode"/>
							</pulsemode>
						</xsl:otherwise>
					</xsl:choose>
					<oscwidth>
						<xsl:value-of select="./osc_width"/>
					</oscwidth>
					<indwell>
						<xsl:value-of select="./indwell"/>
					</indwell>
					<outdwell>
						<xsl:value-of select="./outdwell"/>
					</outdwell>
					<excursion>
						<xsl:value-of select="./excursion"/>
					</excursion>
					<theta>
						<xsl:value-of select="./theta_width"/>
					</theta>
					<prox>
						<xsl:value-of select="./pri_ahc"/>
					</prox>
					<mfc1>
						<xsl:value-of select="./shield_flow"/>
					</mfc1>
					<mfc2>
						<xsl:value-of select="./plasma_flow"/>
					</mfc2>
					<al_mode>
						<xsl:value-of select="./mig_mode"/>
					</al_mode>
					<al_wp>
						<xsl:value-of select="./workpoint"/>
					</al_wp>
					<al_trim>
						<xsl:value-of select="./trim"/>
					</al_trim>
					<al_wc1>
						<xsl:value-of select="./wave_control1"/>
					</al_wc1>
					<al_wc2>
						<xsl:value-of select="./wave_control2"/>
					</al_wc2>
					<al_wc3>
						<xsl:value-of select="./wave_control3"/>
					</al_wc3>
					<al_wc4>
						<xsl:value-of select="./wave_control4"/>
					</al_wc4>
				</seg>
			</xsl:for-each>
		</sched>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>