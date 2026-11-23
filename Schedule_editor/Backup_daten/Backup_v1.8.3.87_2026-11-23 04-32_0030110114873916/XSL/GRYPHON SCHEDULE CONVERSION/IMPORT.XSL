<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:variable name="MILLISECONDS_PER_SECOND" select="1000"/>
	<xsl:variable name="HOTWIRE_CONVERSION_FACTOR" select="4"/>

	<xsl:template match="sched" >
		<sched type="{./head}">
			<head>TEMPLATE</head>
			<numsegs>
				<xsl:value-of select="./numsegs"/>
			</numsegs>
			<desc>
				<od>
					<xsl:value-of select="./desc/od"/>
				</od>
				<note />
			</desc>
			<global>
				<arctype>TOUCH</arctype>
				<prepurge>
					<xsl:value-of select="./global/prepurge"/>
				</prepurge>
				<postpurge>
					<xsl:value-of select="./global/postpurge"/>
				</postpurge>
				<trailgas>0</trailgas>
				<backupgas>0</backupgas>
				<plasmagas>1</plasmagas>
				<pilotArcAuto>0</pilotArcAuto>
				<initcur>
					<xsl:value-of select="./global/initcur"/>
				</initcur>
				<fincur>
					<xsl:value-of select="./global/fincur"/>
				</fincur>
				<impcur>
					<xsl:value-of select="./global/impcur"/>
				</impcur>
				<travdel>
					<xsl:value-of select="./global/travdel"/>
				</travdel>
				<imptime>
					<xsl:value-of select="(./global/imptime div $MILLISECONDS_PER_SECOND)"/>
				</imptime>
				<downslopemode>0</downslopemode>
				<downslope>
					<xsl:value-of select="./global/downslope"/>
				</downslope>
				<travjog>
					<xsl:value-of select="./global/travjog"/>
				</travjog>
				<segadv>
					<xsl:value-of select="./global/segadv"/>
				</segadv>
				<!-- For GT7, 0, 1, -1 for manual, forward and reverse-->
				<!-- For GT6, 0, 1 for forward and reverse-->
				<xsl:choose>
					<xsl:when test="/GryphSched/sched/global/travdir = '0'">
						<travdir>1</travdir>
					</xsl:when>
					<xsl:when test="/GryphSched/sched/global/travdir = '1'">
						<travdir>-1</travdir>
					</xsl:when>
					<xsl:otherwise>
						<travdir>0</travdir>
					</xsl:otherwise>
				</xsl:choose>
				<dlogmode>
					<xsl:value-of select="./global/dlogmode"/>
				</dlogmode>
				<avcgap>
					<xsl:value-of select="./global/avcgap"/>
				</avcgap>
				<avcsens>
					<xsl:value-of select="./global/avcsens"/>
				</avcsens>
				<avchisens>
					<xsl:value-of select="./global/avchisens"/>
				</avchisens>
				<avcdeadband>
					<xsl:value-of select="./global/avcdeadband"/>
				</avcdeadband>
				<avcslowband>
					<xsl:value-of select="./global/avcslowband"/>
				</avcslowband>
				<avcdelay>
					<xsl:value-of select="./global/avcdelay"/>
				</avcdelay>
				<avcstop>
					<xsl:value-of select="./global/avcstop"/>
				</avcstop>
				<avcjog>
					<xsl:value-of select="./global/avcjog"/>
				</avcjog>
				<avcretract>
					<xsl:value-of select="./global/avcretract"/>
				</avcretract>
				<avcstep>0.01</avcstep>
				<wiredel>
					<xsl:value-of select="./global/wiredel"/>
				</wiredel>
				<wireret>
					<xsl:value-of select="./global/wireret"/>
				</wireret>
				<wirejogfwd>
					<xsl:value-of select="./global/wirejogfwd"/>
				</wirejogfwd>
				<wirejogrev>
					<xsl:value-of select="./global/wirejogrev"/>
				</wirejogrev>
				<wirestep>
					<xsl:value-of select="./global/wirestep"/>
				</wirestep>
				<wire2del>
					<xsl:value-of select="./global/wire2del"/>
				</wire2del>
				<wire2ret>
					<xsl:value-of select="./global/wire2ret"/>
				</wire2ret>
				<wire2jogfwd>
					<xsl:value-of select="./global/wire2jogfwd"/>
				</wire2jogfwd>
				<wire2jogrev>
					<xsl:value-of select="./global/wire2jogrev"/>
				</wire2jogrev>
				<wire2step>0</wire2step>
				<hotwire>
					<xsl:value-of select="./global/hotwire"/>
				</hotwire>
				<hotwire2>
					<xsl:value-of select="./global/hotwire2"/>
				</hotwire2>
				<hotwire_mode>
					<xsl:value-of select="./global/hotwire_mode"/>
				</hotwire_mode>
				<oscsync>0</oscsync>
				<oscjog>
					<xsl:value-of select="./global/oscjog"/>
				</oscjog>
				<oscstep>
					<xsl:value-of select="./global/oscstep"/>
				</oscstep>
				<thetajog>
					<xsl:value-of select="./global/thetajog"/>
				</thetajog>
				<thetastep>0</thetastep>
				<aux0_jog>
					<xsl:value-of select="./global/auxjog0"/>
				</aux0_jog>
				<aux1_jog>
					<xsl:value-of select="./global/auxjog1"/>
				</aux1_jog>
				<aux2_jog>
					<xsl:value-of select="./global/auxjog2"/>
				</aux2_jog>
				<aux3_jog>
					<xsl:value-of select="./global/auxjog3"/>
				</aux3_jog>
				<aux4_jog>
					<xsl:value-of select="./global/auxjog4"/>
				</aux4_jog>
				<aux5_jog>
					<xsl:value-of select="./global/auxjog5"/>
				</aux5_jog>
				<aux6_jog>
					<xsl:value-of select="./global/auxjog6"/>
				</aux6_jog>
				<aux7_jog>
					<xsl:value-of select="./global/auxjog7"/>
				</aux7_jog>
				<aux8_jog>
					<xsl:value-of select="./global/auxjog8"/>
				</aux8_jog>
				<aux9_jog>
					<xsl:value-of select="./global/auxjog9"/>
				</aux9_jog>
				<aux9_jog>
					<xsl:value-of select="./global/auxjog9"/>
				</aux9_jog>
				<!-- AAO schedules add in some tags for GT7 that do not exist on GT6 so insert them if they exist -->
				<xsl:choose>
					<xsl:when test="./global/wire_manipulator_up_down_jog">
						<wire_manipulator_up_down_jog>
							<xsl:value-of select="./global/wire_manipulator_up_down_jog"/>
						</wire_manipulator_up_down_jog>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./global/wire_manipulator_up_down_step">
						<wire_manipulator_up_down_step>
							<xsl:value-of select="./global/wire_manipulator_up_down_step"/>
						</wire_manipulator_up_down_step>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>				
				<xsl:choose>
					<xsl:when test="./global/wire_manipulator_in_out_jog">
						<wire_manipulator_in_out_jog>
							<xsl:value-of select="./global/wire_manipulator_in_out_jog"/>
						</wire_manipulator_in_out_jog>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
				<xsl:when test="./global/wire_manipulator_in_out_step">
						<wire_manipulator_in_out_step>
							<xsl:value-of select="./global/wire_manipulator_in_out_step"/>
						</wire_manipulator_in_out_step>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>				
				<xsl:choose>
					<xsl:when test="./global/tungsten_jog">
						<tungsten_jog>
							<xsl:value-of select="./global/tungsten_jog"/>
						</tungsten_jog>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
				<xsl:when test="./global/tungsten_step">
					<tungsten_step>
						<xsl:value-of select="./global/tungsten_step"/>
					</tungsten_step>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./global/wire_manipulator_in_out_auto_preposition">
						<wire_manipulator_in_out_auto_preposition>
							<xsl:value-of select="./global/wire_manipulator_in_out_auto_preposition"/>
						</wire_manipulator_in_out_auto_preposition>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./global/wire_manipulator_in_out_auto_postposition">
						<wire_manipulator_in_out_auto_postposition>
							<xsl:value-of select="./global/wire_manipulator_in_out_auto_postposition"/>
						</wire_manipulator_in_out_auto_postposition>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./global/tungsten_auto_preposition">
						<tungsten_auto_preposition>
							<xsl:value-of select="./global/tungsten_auto_preposition"/>
						</tungsten_auto_preposition>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./global/tungsten_auto_postposition">
						<tungsten_auto_postposition>
							<xsl:value-of select="./global/tungsten_auto_postposition"/>
						</tungsten_auto_postposition>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<oscautopos>0</oscautopos>
				<excursion_mode>0</excursion_mode>
				<groovetrackmaxcorr_mode>0</groovetrackmaxcorr_mode>
				<groovetracksense_mode>0</groovetracksense_mode>
				<travautopos>0</travautopos>
				<travautozero>0</travautozero>
				<travstep>0</travstep>
				<burn_back_time>0.2</burn_back_time>
				<use_motion_pulse>0</use_motion_pulse>
				<cut_angle>0</cut_angle>
				<electrode_diameter>0</electrode_diameter>
				<seamtrack_x_tracking_on>1</seamtrack_x_tracking_on>
				<seamtrack_z_tracking_on>0</seamtrack_z_tracking_on>
				<seamtrack_width_tracking_on>0</seamtrack_width_tracking_on>
				<seamtrack_x_channel>1</seamtrack_x_channel>
				<seamtrack_z_channel>2</seamtrack_z_channel>
				<seamtrack_width_channel>3</seamtrack_width_channel>
				<seamtrack_program>1</seamtrack_program>
				<seamtrack_angle>0</seamtrack_angle>
			</global>
			<limits>
				<priamperr>
					<xsl:value-of select="./limits/priamperr"/>
				</priamperr>
				<priampflt>
					<xsl:value-of select="./limits/priampflt"/>
				</priampflt>
				<bkgamperr>
					<xsl:value-of select="./limits/bkgamperr"/>
				</bkgamperr>
				<bkgampflt>
					<xsl:value-of select="./limits/bkgampflt"/>
				</bkgampflt>
				<traverr>
					<xsl:value-of select="./limits/traverr"/>
				</traverr>
				<travflt>
					<xsl:value-of select="./limits/travflt"/>
				</travflt>
				<voltlow>
					<xsl:value-of select="./limits/voltlow"/>
				</voltlow>
				<volthigh>
					<xsl:value-of select="./limits/volthigh"/>
				</volthigh>
			</limits>
			<overrides>
				<ampMax>
					<xsl:value-of select="./overrides/ampMax"/>
				</ampMax>
				<ampRate>
					<xsl:value-of select="./overrides/ampRate"/>
				</ampRate>
				<travelMax>
					<xsl:value-of select="./overrides/travelMax"/>
				</travelMax>
				<travelRate>
					<xsl:value-of select="./overrides/travelRate"/>
				</travelRate>
				<wireMax>
					<xsl:value-of select="./overrides/wireMax"/>
				</wireMax>
				<wireRate>
					<xsl:value-of select="./overrides/wireRate"/>
				</wireRate>
				<wireRetractDistMax>10</wireRetractDistMax>
				<wireRetractDistRate>0.1</wireRetractDistRate>
				<avgWireSpeedMax>10</avgWireSpeedMax>
				<avgWireSpeedRate>0.5</avgWireSpeedRate>
				<wire2Max>
					<xsl:value-of select="./overrides/wireMax"/>
				</wire2Max>
				<wire2Rate>
					<xsl:value-of select="./overrides/wireRate"/>
				</wire2Rate>
				<wire2RetractDistMax>10</wire2RetractDistMax>
				<wire2RetractDistRate>0.1</wire2RetractDistRate>
				<avgWire2SpeedMax>10</avgWire2SpeedMax>
				<avgWire2SpeedRate>0.5</avgWire2SpeedRate>
				<xsl:choose>
					<xsl:when test="./overrides/hotwire_amps_max">
						<hotwire1AmpsMax>
							<xsl:value-of select="./overrides/hotwire_amps_max"/>
						</hotwire1AmpsMax>
					</xsl:when>
					<xsl:otherwise>
						<hotwire1AmpsMax>10</hotwire1AmpsMax>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./overrides/hotwire_amps_rate">
						<hotwire1AmpsRate>
							<xsl:value-of select="./overrides/hotwire_amps_rate"/>
						</hotwire1AmpsRate>
					</xsl:when>
					<xsl:otherwise>
						<hotwire1AmpsRate>1</hotwire1AmpsRate>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./overrides/hotwire2_amps_max">
						<hotwire2AmpsMax>
							<xsl:value-of select="./overrides/hotwire2_amps_max"/>
						</hotwire2AmpsMax>
					</xsl:when>
					<xsl:otherwise>
						<hotwire2AmpsMax>10</hotwire2AmpsMax>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./overrides/hotwire2_amps_rate">
						<hotwire2AmpsRate>
							<xsl:value-of select="./overrides/hotwire2_amps_rate"/>
						</hotwire2AmpsRate>
					</xsl:when>
					<xsl:otherwise>
						<hotwire2AmpsRate>1</hotwire2AmpsRate>
					</xsl:otherwise>
				</xsl:choose>
				<voltMax>
					<xsl:value-of select="./overrides/voltMax"/>
				</voltMax>
				<voltRate>
					<xsl:value-of select="./overrides/voltRate"/>
				</voltRate>
				<oscWidthMax>
					<xsl:value-of select="./overrides/oscWidthMax"/>
				</oscWidthMax>
				<oscWidthRate>
					<xsl:value-of select="./overrides/oscWidthRate"/>
				</oscWidthRate>
				<thetaWidthMax>
					<xsl:value-of select="./overrides/thetaMax"/>
				</thetaWidthMax>
				<thetaWidthRate>
					<xsl:value-of select="./overrides/thetaRate"/>
				</thetaWidthRate>
				<dwellMax>
					<xsl:value-of select="./overrides/dwellMax"/>
				</dwellMax>
				<dwellRate>
					<xsl:value-of select="./overrides/dwellRate"/>
				</dwellRate>
				<excursionMax>
					<xsl:value-of select="./overrides/excursionMax"/>
				</excursionMax>
				<excursionRate>
					<xsl:value-of select="./overrides/excursionRate"/>
				</excursionRate>
				<mig_ultimarc_override_max>10</mig_ultimarc_override_max>
				<mig_ultimarc_override_rate>0.1</mig_ultimarc_override_rate>
				<mig_pinch_override_max>10</mig_pinch_override_max>
				<mig_pinch_override_rate>0.1</mig_pinch_override_rate>
				<mig_trim_override_max>10</mig_trim_override_max>
				<mig_trim_override_rate>0.1</mig_trim_override_rate>
				<prox_override_max>10</prox_override_max>
				<prox_override_rate>1.0</prox_override_rate>
				<xsl:choose>
					<xsl:when test="./overrides/wire_manipulator_in_out_width_max">
						<wire_manipulator_in_out_width_max>
							<xsl:value-of select="./overrides/wire_manipulator_in_out_width_max"/>
						</wire_manipulator_in_out_width_max>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./overrides/wire_manipulator_in_out_width_rate">
						<wire_manipulator_in_out_width_rate>
							<xsl:value-of select="./overrides/wire_manipulator_in_out_width_rate"/>
						</wire_manipulator_in_out_width_rate>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./overrides/tungsten_width_max">
						<tungsten_width_max>
							<xsl:value-of select="./overrides/tungsten_width_max"/>
						</tungsten_width_max>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose>
					<xsl:when test="./overrides/tungsten_width_rate">
						<tungsten_width_rate>
							<xsl:value-of select="./overrides/tungsten_width_rate"/>
						</tungsten_width_rate>
					</xsl:when>
					<xsl:otherwise>
					</xsl:otherwise>
				</xsl:choose>
			</overrides>
			<xsl:choose>
				<xsl:when test="./seg" />
				<xsl:otherwise>
					<seg index="0">
						<enable>1</enable>
						<mode>0</mode>
						<segtime>0</segtime>
						<slope>0</slope>
						<prox>0</prox>
						<priamp>0</priamp>
						<bkgamp>0</bkgamp>
						<pulsefreq>0</pulsefreq>
						<pulsewidth>0</pulsewidth>
						<motionpulsefreq>0</motionpulsefreq>
						<motionpulsewidth>0</motionpulsewidth>
						<pritrav>0</pritrav>
						<bkgtrav>0</bkgtrav>
						<priwire>0</priwire>
						<bkgwire>0</bkgwire>
						<priwire2>0</priwire2>
						<bkgwire2>0</bkgwire2>
						<privolt>0</privolt>
						<bkgvolt>0</bkgvolt>
						<avcmode>0</avcmode>
						<sync_mode>1</sync_mode>
						<oscwidth>0</oscwidth>
						<thetawidth>0</thetawidth>
						<indwell>0</indwell>
						<outdwell>0</outdwell>
						<excursion>0</excursion>
						<ampspulse>1</ampspulse>
						<travpulse>0</travpulse>
						<wirepulse>1</wirepulse>
						<wire2pulse>1</wire2pulse>
						<hotwire_amps>0</hotwire_amps>
						<hotwire2_amps>0</hotwire2_amps>
						<al_mode>0</al_mode>
						<al_wp>0</al_wp>
						<al_trim>0</al_trim>
						<al_wc1>0</al_wc1>
						<al_wc2>0</al_wc2>
						<al_wc3>0</al_wc3>
						<al_wc4>0</al_wc4>
						<groovetracking_mode>1</groovetracking_mode>
						<groovetracking_sense>0.2</groovetracking_sense>
						<groovetracking_maxcorrection>0.015</groovetracking_maxcorrection>
						<groovetracking_bias>0</groovetracking_bias>
					</seg>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:for-each select="./seg">
				<seg index="{./@index}">
					<enable>1</enable>
					<!-- For GT7, 0, 1, 2 for time, distance and manual-->
					<!-- For GT6, 0, 1, 2 for time, manual and distance-->
					<xsl:choose>
						<xsl:when test="/GryphSched/sched/global/timingmode = '1'">
							<mode>2</mode>
						</xsl:when>
						<xsl:when test="/GryphSched/sched/global/timingmode = '2'">
							<mode>1</mode>
						</xsl:when>
						<xsl:otherwise>
							<mode>0</mode>
						</xsl:otherwise>
					</xsl:choose>
					<segtime>
						<xsl:value-of select="./segtime"/>
					</segtime>
					<slope>
						<xsl:value-of select="./slope"/>
					</slope>
					<prox>
						<xsl:value-of select="./prox"/>
					</prox>
					<priamp>
						<xsl:value-of select="./priamp"/>
					</priamp>
					<bkgamp>
						<xsl:value-of select="./bkgamp"/>
					</bkgamp>
					<pulsefreq>
						<xsl:value-of select="./pulsefreq"/>
					</pulsefreq>
					<pulsewidth>
						<xsl:value-of select="./pulsewidth"/>
					</pulsewidth>
					<motionpulsefreq>
						<xsl:value-of select="./pulsefreq"/>
					</motionpulsefreq>
					<motionpulsewidth>
						<xsl:value-of select="./pulsewidth"/>
					</motionpulsewidth>
					<pritrav>
						<xsl:value-of select="./pritrav"/>
					</pritrav>
					<bkgtrav>
						<xsl:value-of select="./bkgtrav"/>
					</bkgtrav>
					<priwire>
						<xsl:value-of select="./priwire"/>
					</priwire>
					<bkgwire>
						<xsl:value-of select="./bkgwire"/>
					</bkgwire>
					<priwire2>
						<xsl:value-of select="./priwire2"/>
					</priwire2>
					<bkgwire2>
						<xsl:value-of select="./bkgwire2"/>
					</bkgwire2>
					<privolt>
						<xsl:value-of select="./privolt"/>
					</privolt>
					<bkgvolt>
						<xsl:value-of select="./bkgvolt"/>
					</bkgvolt>
					<avcmode>
						<xsl:value-of select="./avcmode"/>
					</avcmode>
					<!-- For GT7, 0, 1, 3 for disabled, arc sync and osc sync-->
					<!-- For GT6, 0, 1, 2 for disabled, parc and sync-->
					<xsl:choose>
						<xsl:when test="./pulsemode = '2'">
							<sync_mode>
								<xsl:value-of select="3"/>
							</sync_mode>
						</xsl:when>
						<xsl:otherwise>
							<sync_mode>
								<xsl:value-of select="./pulsemode"/>
							</sync_mode>
						</xsl:otherwise>
					</xsl:choose>
					<oscwidth>
						<xsl:value-of select="./oscwidth"/>
					</oscwidth>
					<thetawidth>
						<xsl:value-of select="./theta"/>
					</thetawidth>
					<indwell>
						<xsl:value-of select="./indwell"/>
					</indwell>
					<outdwell>
						<xsl:value-of select="./outdwell"/>
					</outdwell>
					<excursion>
						<xsl:value-of select="./excursion"/>
					</excursion>
					<ampspulse>1</ampspulse>
					<travpulse>0</travpulse>
					<wirepulse>1</wirepulse>
					<wire2pulse>1</wire2pulse>
					<xsl:choose>
						<xsl:when test="./hotwire_amps">
							<hotwireamps>
								<xsl:value-of select="./hotwire_amps"/>
							</hotwireamps>
						</xsl:when>
						<xsl:otherwise>
							<hotwireamps>0</hotwireamps>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="./hotwire2_amps">
							<hotwire2amps>
								<xsl:value-of select="./hotwire2_amps"/>
							</hotwire2amps>
						</xsl:when>
						<xsl:otherwise>
							<hotwire2amps>0</hotwire2amps>
						</xsl:otherwise>
					</xsl:choose>
					<al_mode>
						<xsl:value-of select="./al_mode"/>
					</al_mode>
					<al_wp>
						<xsl:value-of select="./al_wp"/>
					</al_wp>
					<al_trim>
						<xsl:value-of select="./al_trim"/>
					</al_trim>
					<al_wc1>
						<xsl:value-of select="./al_wc1"/>
					</al_wc1>
					<al_wc2>
						<xsl:value-of select="./al_wc2"/>
					</al_wc2>
					<al_wc3>
						<xsl:value-of select="./al_wc3"/>
					</al_wc3>
					<al_wc4>
						<xsl:value-of select="./al_wc4"/>
					</al_wc4>
					<groovetracking_mode>1</groovetracking_mode>
					<groovetracking_sense>0.2</groovetracking_sense>
					<groovetracking_maxcorrection>0.015</groovetracking_maxcorrection>
					<groovetracking_bias>0</groovetracking_bias>
					<xsl:choose>
						<xsl:when test="./wire_manipulator_in_out_width">
							<wire_manipulator_in_out_width>
								<xsl:value-of select="./wire_manipulator_in_out_width"/>
							</wire_manipulator_in_out_width>
						</xsl:when>
						<xsl:otherwise>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="./tungsten_width">
							<tungsten_width>
								<xsl:value-of select="./tungsten_width"/>
							</tungsten_width>
						</xsl:when>
						<xsl:otherwise>
						</xsl:otherwise>
					</xsl:choose>
				</seg>
			</xsl:for-each>
		</sched>
	</xsl:template>

	<!--NOTE: Identity transform-->
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

	<!--
		NOTE: Apply the main transform template to the GryphSched node so that when we remove 
		the GryphSched node, the changes we just made persist
	-->
	<xsl:template match="GryphSched">
		<xsl:apply-templates select="@*|node()"/>
	</xsl:template>

	<!--
		NOTE: This transform deletes the GryphSched node while keeping the sched node
	-->
	<xsl:template match="GryphSched/*[not(self::sched)]"/>

</xsl:stylesheet>