<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/ahc_auto_postposition">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/initial_travel_speed"/>
			<xsl:otherwise>
				<initial_travel_speed>1</initial_travel_speed>
				<initial_volts>0</initial_volts>
				<xsl:choose>
					<xsl:when test="/sched/global/wire_manipulator_up_down_jog">
						<wire_manipulator_up_down_jog>
							<xsl:value-of select="/sched/global/wire_manipulator_up_down_jog"/>
						</wire_manipulator_up_down_jog>
						<wire_manipulator_up_down_step>
							<xsl:value-of select="/sched/global/wire_manipulator_up_down_step"/>
						</wire_manipulator_up_down_step>
						<wire_manipulator_in_out_jog>
							<xsl:value-of select="/sched/global/wire_manipulator_in_out_jog"/>
						</wire_manipulator_in_out_jog>
						<wire_manipulator_in_out_step>
							<xsl:value-of select="/sched/global/wire_manipulator_in_out_step"/>
						</wire_manipulator_in_out_step>
					</xsl:when>
					<xsl:otherwise>
						<wire_manipulator_up_down_jog>5</wire_manipulator_up_down_jog>
						<wire_manipulator_up_down_step>0</wire_manipulator_up_down_step>
						<wire_manipulator_in_out_jog>5</wire_manipulator_in_out_jog>
						<wire_manipulator_in_out_step>0</wire_manipulator_in_out_step>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/sched/global/initial_volts">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/wire_manipulator_up_down_jog">
				<wire_manipulator_up_down_jog>
					<xsl:value-of select="/sched/global/wire_manipulator_up_down_jog"/>
				</wire_manipulator_up_down_jog>
				<wire_manipulator_up_down_step>
					<xsl:value-of select="/sched/global/wire_manipulator_up_down_step"/>
				</wire_manipulator_up_down_step>
				<wire_manipulator_in_out_jog>
					<xsl:value-of select="/sched/global/wire_manipulator_in_out_jog"/>
				</wire_manipulator_in_out_jog>
				<wire_manipulator_in_out_step>
					<xsl:value-of select="/sched/global/wire_manipulator_in_out_step"/>
				</wire_manipulator_in_out_step>
			</xsl:when>
			<xsl:otherwise>
				<wire_manipulator_up_down_jog>5</wire_manipulator_up_down_jog>
				<wire_manipulator_up_down_step>0</wire_manipulator_up_down_step>
				<wire_manipulator_in_out_jog>5</wire_manipulator_in_out_jog>
				<wire_manipulator_in_out_step>0</wire_manipulator_in_out_step>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="sched/global/wire_manipulator_up_down_jog"/>
	<xsl:template match="sched/global/wire_manipulator_up_down_step"/>
	<xsl:template match="sched/global/wire_manipulator_in_out_jog"/>
	<xsl:template match="sched/global/wire_manipulator_in_out_step"/>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>