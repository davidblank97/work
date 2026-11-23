<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/language[@localeID='en-CA']/text[@id='65549']">
		<text id="65549">
			<content>Set the output of the variable power supply to be between 5 - 6 Volts.</content>
			<desc>Message text prompting the user to adjust the external power supply's output to be between 5 - 6V. This is a step of a calibration procedure.</desc>
		</text>
	</xsl:template>
	<xsl:template match="/language[@localeID='en-CA']/text[@id='65550']">
		<text id="65550">
			<content>Set the output of the variable power supply to be between 25 - 30 Volts.</content>
			<desc>Message text prompting the user to adjust the external power supply's output to be between 25 - 30V. This is a step of a calibration procedure.</desc>
		</text>
	</xsl:template>

	<xsl:template match="/language[@localeID='fr-FR']/text[@id='65549']">
		<text id="65549">
			<content>Réglez la tension de l'alimentation stabilisée entre 5 et 6 volts.</content>
			<desc>Message text prompting the user to adjust the external power supply's output to be between 5 - 6V. This is a step of a calibration procedure.</desc>
		</text>
	</xsl:template>
	<xsl:template match="/language[@localeID='fr-FR']/text[@id='65550']">
		<text id="65550">
			<content>Réglez la tension de l'alimentation stabilisée entre 25 et 30 volts.</content>
			<desc>Message text prompting the user to adjust the external power supply's output to be between 25 - 30V. This is a step of a calibration procedure.</desc>
		</text>
	</xsl:template>
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>