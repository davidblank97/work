<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='servo_velocity_smoothing_factor']">
		<xsl:choose>
			<xsl:when test="/user_preferences/preference[@tag='servo_velocity_steady_state_smoothing_factor']">
			</xsl:when>
			<xsl:otherwise>
				<preference tag="servo_velocity_steady_state_smoothing_factor" value="0.85"/>
				<preference tag="servo_velocity_rise_time_smoothing_factor" value="0.3"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
		
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>