<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	
	<xsl:template match="/system_user_units/parameters/*[last()]">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/system_user_units/parameters/parameter[@id='268041']">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<parameter id="268041" mode="0" unit="analog_voltage"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/system_user_units/parameters/parameter[@id='268042']">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<parameter id="268042" mode="0" unit="analog_voltage"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/system_user_units/parameters/parameter[@id='268043']">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<parameter id="268043" mode="0" unit="analog_voltage"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/system_user_units/parameters/parameter[@id='268044']">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<parameter id="268044" mode="0" unit="analog_voltage"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/system_user_units/parameters/parameter[@id='268045']">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<parameter id="268045" mode="0" unit="analog_voltage"/>
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